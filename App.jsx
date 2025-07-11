const { useState, useEffect, useMemo, useCallback, createContext, useContext } = React;

const StorageContext = createContext(null);

const StorageProvider = ({ children }) => {
    const [storageData, setStorageData] = useState({ directoryHandle: null, isStorageReady: false, error: null });

    useEffect(() => {
        async function init() {
            try {
                await initializeStorage();
                setStorageData({ directoryHandle: window.directoryHandle, isStorageReady: true, error: null });
            } catch (e) {
                console.error("Storage initialization failed:", e);
                setStorageData({ directoryHandle: null, isStorageReady: true, error: e.message });
            }
        }
        init();
    }, []);

    return <StorageContext.Provider value={storageData}>{children}</StorageContext.Provider>;
};

const useCollection = (collectionName, defaultData = []) => {
    const { isStorageReady } = useContext(StorageContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isStorageReady) {
            setLoading(false);
            return;
        }
        async function loadData() {
            setLoading(true);
            try {
                const items = await readCollection(collectionName);
                if (items.length === 0 && defaultData.length > 0) {
                    await writeCollection(collectionName, defaultData);
                    setData(defaultData);
                } else {
                    setData(items);
                }
            } catch (e) {
                console.error(`Error loading ${collectionName}:`, e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [isStorageReady, collectionName]);

    return { data, loading, setData };
};

function App() {
    return (
        <StorageProvider>
            <AppContent />
        </StorageProvider>
    );
}

function AppContent() {
    const { isStorageReady, error } = useContext(StorageContext);
    
    const { data: wallets, loading: walletsLoading, setData: setWallets } = useCollection('wallets');
    const { data: categories, loading: categoriesLoading, setData: setCategories } = useCollection('categories', DEFAULT_CATEGORIES);
    const { data: transactions, loading: transactionsLoading, setData: setTransactions } = useCollection('transactions');
    const { data: debts, loading: debtsLoading, setData: setDebts } = useCollection('debts');
    const { data: currencies, loading: currenciesLoading, setData: setCurrencies } = useCollection('currencies', DEFAULT_CURRENCIES);
    const { data: budgets, loading: budgetsLoading, setData: setBudgets } = useCollection('budgets');

    const [activeView, setActiveView] = useState('dashboard');
    const [modalStack, setModalStack] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const isLoading = walletsLoading || categoriesLoading || transactionsLoading || debtsLoading || currenciesLoading || budgetsLoading;

    const walletCalculations = useMemo(() => {
        const balances = {};
        const lastActivity = {};
        wallets.forEach(w => {
            balances[w.id] = w.initialBalance || 0;
            lastActivity[w.id] = w.createdAt || new Date();
        });
        transactions.forEach(t => {
            if (balances[t.walletId] !== undefined) {
                balances[t.walletId] += (t.type === 'income' ? t.amount : -t.amount);
                if (new Date(t.date) > new Date(lastActivity[t.walletId])) {
                    lastActivity[t.walletId] = t.date;
                }
            }
        });
        return { balances, lastActivity };
    }, [wallets, transactions]);

    const openModal = useCallback((type, data = {}, options = {}) => {
        setModalStack(prev => [...prev, { type, data, options }]);
    }, []);

    const closeModal = useCallback(() => {
        setModalStack(prev => prev.slice(0, -1));
    }, []);

    const openConfirmDelete = useCallback((type, id, name) => {
        setConfirmDelete({ type, id, name });
    }, []);

    const closeConfirmDelete = useCallback(() => {
        setConfirmDelete(null);
    }, []);

    const handleSave = useCallback(async (itemType, data, setError) => {
        if (!isStorageReady) {
            setError("Storage not initialized.");
            return { success: false };
        }
        try {
            const collectionName = `${itemType}s`;
            const items = await readCollection(collectionName);
            const { id, ...payload } = data;
            const newItem = { ...payload, id: id || generateUUID(), createdAt: new Date() };
            const updatedItems = id
                ? items.map(item => (item.id === id ? newItem : item))
                : [...items, newItem];
            await writeCollection(collectionName, updatedItems);

            if (itemType === 'wallet') setWallets(updatedItems);
            if (itemType === 'category') setCategories(updatedItems);
            if (itemType === 'transaction') setTransactions(updatedItems);
            if (itemType === 'debt') setDebts(updatedItems);
            if (itemType === 'currency') setCurrencies(updatedItems);
            if (itemType === 'budget') setBudgets(updatedItems);

            closeModal();
            const { onSaveSuccess } = modalStack[modalStack.length - 1]?.options || {};
            if (onSaveSuccess) onSaveSuccess(newItem);
            return { success: true, message: `${itemType} saved successfully.` };
        } catch (e) {
            console.error(`Error saving ${itemType}:`, e);
            setError("Failed to save item. Please try again.");
            return { success: false };
        }
    }, [isStorageReady, modalStack, closeModal, setWallets, setCategories, setTransactions, setDebts, setCurrencies, setBudgets]);

    const handleSaveDebt = useCallback(async (debtData, createTransaction, setError) => {
        if (!isStorageReady) {
            setError("Storage not initialized.");
            return { success: false };
        }
        try {
            const isEditing = !!debtData.id;
            const debts = await readCollection('debts');
            const newDebt = {
                ...debtData,
                id: debtData.id || generateUUID(),
                createdAt: new Date(),
                date: new Date(debtData.date),
                deadline: debtData.deadline ? new Date(debtData.deadline) : null
            };
            const updatedDebts = isEditing
                ? debts.map(d => (d.id === newDebt.id ? newDebt : d))
                : [...debts, newDebt];
            await writeCollection('debts', updatedDebts);
            setDebts(updatedDebts);

            if (!isEditing && createTransaction.enabled) {
                const wallet = wallets.find(w => w.id === createTransaction.walletId);
                if (!wallet || wallet.currency !== debtData.currency) {
                    setError("Selected wallet's currency does not match debt currency.");
                    return { success: false };
                }
                const lendingCategory = categories.find(c => c.name === LENDING_CATEGORY);
                if (!lendingCategory) {
                    setError("'Lending' category not found. Please create it in Parameters.");
                    return { success: false };
                }

                const transactions = await readCollection('transactions');
                const newTransaction = {
                    id: generateUUID(),
                    description: `Loan to ${debtData.person}`,
                    amount: debtData.total,
                    type: 'expense',
                    walletId: createTransaction.walletId,
                    categoryId: lendingCategory.id,
                    date: new Date(debtData.date),
                    details: `Initial amount for debt: ${debtData.name}`,
                    createdAt: new Date()
                };
                await writeCollection('transactions', [...transactions, newTransaction]);
                setTransactions(prev => [...prev, newTransaction]);
            }

            closeModal();
            return { success: true, message: "Debt saved successfully." };
        } catch (e) {
            console.error("Error saving debt:", e);
            setError("Failed to save debt. Please try again.");
            return { success: false };
        }
    }, [isStorageReady, wallets, categories, closeModal, setDebts, setTransactions]);

    const handleDebtPayment = useCallback(async (paymentData, setError) => {
        if (!isStorageReady) {
            setError("Storage not initialized.");
            return { success: false };
        }
        try {
            const { debtId, walletId, amount, date } = paymentData;
            const debt = debts.find(d => d.id === debtId);
            if (!debt) {
                setError("Selected debt not found.");
                return { success: false };
            }
            if (debt.paid + amount > debt.total) {
                setError("Payment amount exceeds remaining debt.");
                return { success: false };
            }

            const debtPaymentCategory = categories.find(c => c.name === DEBT_PAYMENT_CATEGORY);
            if (!debtPaymentCategory) {
                setError("'Debt Payments' category not found. Please create it in Parameters.");
                return { success: false };
            }

            const transactions = await readCollection('transactions');
            const newTransaction = {
                id: generateUUID(),
                description: `Payment for ${debt.name}`,
                amount,
                type: debt.type === 'owedByMe' ? 'expense' : 'income',
                walletId,
                categoryId: debtPaymentCategory.id,
                date: new Date(date),
                details: `Payment related to debt with ${debt.person}`,
                createdAt: new Date()
            };
            await writeCollection('transactions', [...transactions, newTransaction]);
            setTransactions(prev => [...prev, newTransaction]);

            const updatedDebts = debts.map(d => d.id === debtId ? { ...d, paid: d.paid + amount } : d);
            await writeCollection('debts', updatedDebts);
            setDebts(updatedDebts);

            closeModal();
            return { success: true, message: "Payment recorded successfully." };
        } catch (e) {
            console.error("Error processing debt payment:", e);
            setError("Failed to process payment. Please try again.");
            return { success: false };
        }
    }, [isStorageReady, debts, categories, closeModal, setTransactions, setDebts]);

    const handleDelete = useCallback(async (type, id, setError) => {
        if (!isStorageReady) {
            setError("Storage not initialized.");
            return { success: false };
        }
        try {
            const collectionName = `${type}s`;
            const items = await readCollection(collectionName);
            if (type === 'category') {
                if (transactions.some(t => t.categoryId === id)) {
                    setError("Cannot delete category. It is currently in use by one or more transactions.");
                    return { success: false };
                }
            }
            if (type === 'currency') {
                const currencyToDelete = currencies.find(c => c.id === id)?.name;
                if (wallets.some(w => w.currency === currencyToDelete) || debts.some(d => d.currency === currencyToDelete)) {
                    setError("Cannot delete currency. It is in use by a wallet or debt.");
                    return { success: false };
                }
            }
            if (type === 'wallet') {
                if (transactions.some(t => t.walletId === id)) {
                    setError("Cannot delete wallet. It is currently in use by one or more transactions.");
                    return { success: false };
                }
            }
            if (type === 'debt') {
                const debt = debts.find(d => d.id === id);
                const transactionsData = await readCollection('transactions');
                const relatedTransactions = transactionsData.filter(t => t.details?.includes(`Initial amount for debt: ${debt?.name}`));
                const updatedTransactions = transactionsData.filter(t => !relatedTransactions.some(rt => rt.id === t.id));
                await writeCollection('transactions', updatedTransactions);
                setTransactions(updatedTransactions);
                if (debt?.attachment) await deleteAttachment(debt.attachment);
            }

            const updatedItems = items.filter(item => item.id !== id);
            await writeCollection(collectionName, updatedItems);

            if (type === 'wallet') setWallets(updatedItems);
            if (type === 'category') setCategories(updatedItems);
            if (type === 'transaction') {
                const transaction = transactions.find(t => t.id === id);
                if (transaction?.attachment) await deleteAttachment(transaction.attachment);
                setTransactions(updatedItems);
            }
            if (type === 'debt') setDebts(updatedItems);
            if (type === 'currency') setCurrencies(updatedItems);
            if (type === 'budget') setBudgets(updatedItems);

            closeConfirmDelete();
            return { success: true, message: `${type} deleted successfully.` };
        } catch (e) {
            console.error(`Error deleting ${type}:`, e);
            setError("Failed to delete item. Please try again.");
            return { success: false };
        }
    }, [isStorageReady, wallets, transactions, debts, currencies, closeConfirmDelete, setWallets, setCategories, setTransactions, setDebts, setCurrencies, setBudgets]);

    if (!isStorageReady || isLoading) {
        return (
            <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center text-center p-4">
                <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-fuchsia-500 mb-6"></div>
                <p className="text-xl font-semibold text-gray-300">Loading your secure data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center text-center p-4">
                <div className="text-5xl mb-6">😞</div>
                <p className="text-xl font-semibold text-red-400">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-xl">Retry</button>
            </div>
        );
    }

    const renderView = () => {
        const props = { openModal, handleDelete: (type, id, name) => openConfirmDelete(type, id, name) };
        switch (activeView) {
            case 'dashboard': return <DashboardView wallets={wallets} transactions={transactions} debts={debts} categories={categories} budgets={budgets} calculations={walletCalculations} />;
            case 'money': return <MoneyView wallets={wallets} calculations={walletCalculations} transactions={transactions} categories={categories} {...props} />;
            case 'ledger': return <LedgerView debts={debts} {...props} />;
            case 'calendar': return <CalendarView transactions={transactions} wallets={wallets} categories={categories} openModal={openModal} />;
            case 'parameters': return <ParametersView categories={categories} currencies={currencies} budgets={budgets} {...props} />;
            case 'profile': return <ProfileView />;
            default: return <DashboardView wallets={wallets} transactions={transactions} debts={debts} categories={categories} budgets={budgets} calculations={walletCalculations} />;
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen font-sans text-gray-200 flex">
            <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64">
                <header className="lg:hidden p-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
                    <h1 className="text-xl font-bold text-white">Finance Tracker</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white"><MenuIcon /></button>
                </header>
                <main className="flex-1 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
            {modalStack.map((modal, index) => (
                <Modal key={index} isOpen={true} onClose={closeModal} isSubModal={index > 0}>
                    {modal.type === 'wallet' && <WalletForm data={modal.data} onSave={handleSave} currencies={currencies} openModal={openModal} />}
                    {modal.type === 'transaction' && <TransactionForm data={modal.data} wallets={wallets} categories={categories} onSave={handleSave} openModal={openModal} />}
                    {modal.type === 'transactionDetail' && <TransactionDetailView transaction={modal.data} wallets={wallets} categories={categories} openModal={openModal} />}
                    {modal.type === 'category' && <CategoryForm data={modal.data} onSave={handleSave} />}
                    {modal.type === 'currency' && <CurrencyForm data={modal.data} onSave={handleSave} />}
                    {modal.type === 'budget' && <BudgetForm data={modal.data} onSave={handleSave} categories={categories} currencies={currencies} />}
                    {modal.type === 'debt' && <DebtForm data={modal.data} onSave={handleSaveDebt} currencies={currencies} wallets={wallets} balances={walletCalculations.balances} openModal={openModal} />}
                    {modal.type === 'debtPayment' && <DebtPaymentForm debts={debts} wallets={wallets} balances={walletCalculations.balances} onSave={handleDebtPayment} />}
                    {modal.type === 'error' && <ErrorModal message={modal.data.message} />}
                </Modal>
            ))}
            {confirmDelete && (
                <Modal isOpen={true} onClose={closeConfirmDelete}>
                    <ConfirmDeleteModal type={confirmDelete.type} name={confirmDelete.name} onConfirm={() => handleDelete(confirmDelete.type, confirmDelete.id, (msg) => openModal('error', { message: msg }))} onCancel={closeConfirmDelete} />
                </Modal>
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);