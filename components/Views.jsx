const DashboardView = ({ wallets, transactions, debts, categories, budgets, calculations }) => {
    const totalBalance = wallets.reduce((sum, w) => sum + (calculations.balances[w.id] || 0), 0);
    const totalDebts = debts.reduce((sum, d) => sum + (d.total - d.paid), 0);
    const recentTransactions = transactions
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <Page title="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard>
                    <h3 className="text-lg font-semibold text-white">Total Balance</h3>
                    <p className="text-3xl font-bold text-fuchsia-400">{totalBalance.toFixed(2)}</p>
                </GlassCard>
                <GlassCard>
                    <h3 className="text-lg font-semibold text-white">Outstanding Debts</h3>
                    <p className="text-3xl font-bold text-red-400">{totalDebts.toFixed(2)}</p>
                </GlassCard>
                <GlassCard>
                    <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                    <ul className="mt-4 space-y-2">
                        {recentTransactions.map(t => {
                            const wallet = wallets.find(w => w.id === t.walletId);
                            const category = categories.find(c => c.id === t.categoryId);
                            return (
                                <li key={t.id} className="flex justify-between text-gray-300">
                                    <span>{t.description} ({category?.name || 'Unknown'})</span>
                                    <span className={t.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                                        {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)} {wallet?.currency}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </GlassCard>
            </div>
        </Page>
    );
};

const MoneyView = ({ wallets, calculations, transactions, categories, openModal, handleDelete }) => {
    return (
        <Page
            title="Wallets"
            actionButton={
                <button onClick={() => openModal('wallet')} className="text-fuchsia-400 hover:text-fuchsia-300">
                    <PlusIcon />
                </button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map(wallet => {
                    const walletTransactions = transactions.filter(t => t.walletId === wallet.id);
                    return (
                        <GlassCard key={wallet.id}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white">{wallet.name}</h3>
                                <div className="flex space-x-2">
                                    <button onClick={() => openModal('wallet', wallet)} className="text-gray-400 hover:text-white">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => handleDelete('wallet', wallet.id, wallet.name)} className="text-gray-400 hover:text-red-400">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-fuchsia-400">{calculations.balances[wallet.id]?.toFixed(2) || 0} {wallet.currency}</p>
                            <p className="text-gray-400">Last activity: {formatDateTime(calculations.lastActivity[wallet.id])}</p>
                            <button
                                onClick={() => openModal('transaction', { walletId: wallet.id })}
                                className="mt-4 text-fuchsia-400 hover:underline"
                            >
                                Add Transaction
                            </button>
                            {walletTransactions.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-300">Recent Transactions</h4>
                                    <ul className="mt-2 space-y-2">
                                        {walletTransactions.slice(0, 3).map(t => {
                                            const category = categories.find(c => c.id === t.categoryId);
                                            return (
                                                <li key={t.id} className="flex justify-between text-gray-300 text-sm">
                                                    <span>{t.description}</span>
                                                    <span className={t.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                                                        {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </GlassCard>
                    );
                })}
            </div>
        </Page>
    );
};

const LedgerView = ({ debts, openModal, handleDelete }) => {
    return (
        <Page
            title="Ledger"
            actionButton={
                <button onClick={() => openModal('debt')} className="text-fuchsia-400 hover:text-fuchsia-300">
                    <PlusIcon />
                </button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {debts.map(debt => (
                    <GlassCard key={debt.id}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">{debt.name}</h3>
                            <div className="flex space-x-2">
                                <button onClick={() => openModal('debt', debt)} className="text-gray-400 hover:text-white">
                                    <EditIcon />
                                </button>
                                <button onClick={() => handleDelete('debt', debt.id, debt.name)} className="text-gray-400 hover:text-red-400">
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-300">{debt.person}</p>
                        <p className="text-2xl font-bold text-fuchsia-400">{(debt.total - debt.paid).toFixed(2)} {debt.currency} remaining</p>
                        <p className="text-gray-400">Type: {debt.type === 'owedByMe' ? 'Owed by Me' : 'Owed to Me'}</p>
                        <p className="text-gray-400">Deadline: {debt.deadline ? formatDateTime(debt.deadline) : 'None'}</p>
                        {debt.attachment && (
                            <a href={`file:///${debt.attachment}`} target="_blank" className="text-fuchsia-400 hover:underline">
                                View Attachment
                            </a>
                        )}
                        <button
                            onClick={() => openModal('debtPayment', { debtId: debt.id })}
                            className="mt-4 text-fuchsia-400 hover:underline"
                        >
                            Record Payment
                        </button>
                    </GlassCard>
                ))}
            </div>
        </Page>
    );
};

const CalendarView = ({ transactions, wallets, categories, openModal }) => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const transactionsByDay = transactions.reduce((acc, t) => {
        const day = new Date(t.date).getDate();
        acc[day] = acc[day] || [];
        acc[day].push(t);
        return acc;
    }, {});

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    return (
        <Page title="Calendar">
            <div className="flex justify-between mb-6">
                <button onClick={prevMonth} className="text-fuchsia-400 hover:text-fuchsia-300">Previous</button>
                <h2 className="text-xl font-bold text-white">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={nextMonth} className="text-fuchsia-400 hover:text-fuchsia-300">Next</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-gray-400 font-semibold">{day}</div>
                ))}
                {Array(firstDayOfMonth).fill(null).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <div key={day} className="h-24 border border-slate-700 rounded-lg p-2 relative">
                        <span className="absolute top-1 left-2 text-gray-300">{day}</span>
                        {transactionsByDay[day]?.map(t => (
                            <div
                                key={t.id}
                                onClick={() => openModal('transactionDetail', t)}
                                className="text-xs mt-6 p-1 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-600/50"
                            >
                                <span className={t.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                                    {t.type === 'income' ? '+' : '-'}{t.amount}
                                </span>{' '}
                                {categories.find(c => c.id === t.categoryId)?.name}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Page>
    );
};

const ParametersView = ({ categories, currencies, budgets, openModal, handleDelete }) => {
    return (
        <Page title="Parameters">
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Categories</h3>
                        <button onClick={() => openModal('category')} className="text-fuchsia-400 hover:text-fuchsia-300">
                            <PlusIcon />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => (
                            <GlassCard key={category.id} padding="p-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span>{category.icon}</span>
                                        <span className="text-gray-300">{category.name}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => openModal('category', category)} className="text-gray-400 hover:text-white">
                                            <EditIcon />
                                        </button>
                                        <button onClick={() => handleDelete('category', category.id, category.name)} className="text-gray-400 hover:text-red-400">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">Type: {category.type}</p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Currencies</h3>
                        <button onClick={() => openModal('currency')} className="text-fuchsia-400 hover:text-fuchsia-300">
                            <PlusIcon />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currencies.map(currency => (
                            <GlassCard key={currency.id} padding="p-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">{currency.name}</span>
                                    <div className="flex space-x-2">
                                        <button onClick={() => openModal('currency', currency)} className="text-gray-400 hover:text-white">
                                            <EditIcon />
                                        </button>
                                        <button onClick={() => handleDelete('currency', currency.id, currency.name)} className="text-gray-400 hover:text-red-400">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Budgets</h3>
                        <button onClick={() => openModal('budget')} className="text-fuchsia-400 hover:text-fuchsia-300">
                            <PlusIcon />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {budgets.map(budget => (
                            <GlassCard key={budget.id} padding="p-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-gray-300">{budget.name}</span>
                                        <p className="text-fuchsia-400">{budget.amount} {budget.currency}</p>
                                        <p className="text-gray-400 text-sm">
                                            {categories.find(c => c.id === budget.categoryId)?.name || 'Unknown'}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {formatDateTime(budget.startDate)} - {budget.endDate ? formatDateTime(budget.endDate) : 'Ongoing'}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => openModal('budget', budget)} className="text-gray-400 hover:text-white">
                                            <EditIcon />
                                        </button>
                                        <button onClick={() => handleDelete('budget', budget.id, budget.name)} className="text-gray-400 hover:text-red-400">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        </Page>
    );
};

const ProfileView = () => (
    <Page title="Profile">
        <GlassCard>
            <h3 className="text-lg font-semibold text-white">User Profile</h3>
            <p className="text-gray-300">Offline Mode: Data is stored locally on your device.</p>
            <p className="text-gray-400 mt-2">Manage your financial data securely without an internet connection.</p>
        </GlassCard>
    </Page>
);

const TransactionDetailView = ({ transaction, wallets, categories, openModal }) => {
    const wallet = wallets.find(w => w.id === transaction.walletId);
    const category = categories.find(c => c.id === transaction.categoryId);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Transaction Details</h3>
            <GlassCard padding="p-3">
                <p className="text-gray-300"><strong>Description:</strong> {transaction.description}</p>
                <p className="text-gray-300"><strong>Amount:</strong> {transaction.amount} {wallet?.currency}</p>
                <p className="text-gray-300"><strong>Type:</strong> {transaction.type}</p>
                <p className="text-gray-300"><strong>Wallet:</strong> {wallet?.name}</p>
                <p className="text-gray-300"><strong>Category:</strong> {category?.name} {category?.icon}</p>
                <p className="text-gray-300"><strong>Date:</strong> {formatDateTime(transaction.date)}</p>
                {transaction.details && <p className="text-gray-300"><strong>Details:</strong> {transaction.details}</p>}
                {transaction.attachment && (
                    <p className="text-gray-300">
                        <strong>Attachment:</strong>{' '}
                        <a href={`file:///${transaction.attachment}`} target="_blank" className="text-fuchsia-400 hover:underline">
                            {transaction.attachment.split('/').pop()}
                        </a>
                    </p>
                )}
                <button
                    onClick={() => openModal('transaction', transaction)}
                    className="mt-4 text-fuchsia-400 hover:underline"
                >
                    Edit Transaction
                </button>
            </GlassCard>
        </div>
    );
};