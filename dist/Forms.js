import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const WalletForm = ({
  data = {},
  onSave,
  currencies,
  openModal
}) => {
  var _currencies$;
  const [name, setName] = React.useState(data.name || '');
  const [initialBalance, setInitialBalance] = React.useState(data.initialBalance || 0);
  const [currency, setCurrency] = React.useState(data.currency || ((_currencies$ = currencies[0]) === null || _currencies$ === void 0 ? void 0 : _currencies$.name) || '');
  const [error, setError] = React.useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Wallet name is required.');
      return;
    }
    if (isNaN(initialBalance) || initialBalance < 0) {
      setError('Initial balance must be a valid number.');
      return;
    }
    if (!currency) {
      setError('Currency is required.');
      return;
    }
    const result = await onSave('wallet', {
      id: data.id,
      name: name.trim(),
      initialBalance: Number(initialBalance),
      currency
    }, setError);
    if (!result.success) return;
  };
  return /*#__PURE__*/_jsxs("form", {
    onSubmit: handleSubmit,
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx("h3", {
      className: "text-xl font-bold text-white",
      children: data.id ? 'Edit Wallet' : 'Add Wallet'
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "text",
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Wallet Name",
      error: error && error.includes('name') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "number",
      value: initialBalance,
      onChange: e => setInitialBalance(e.target.value),
      placeholder: "Initial Balance",
      error: error && error.includes('balance') ? error : ''
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: currency,
      onChange: e => setCurrency(e.target.value),
      error: error && error.includes('currency') ? error : '',
      children: [/*#__PURE__*/_jsx("option", {
        value: "",
        children: "Select Currency"
      }), currencies.map(c => /*#__PURE__*/_jsx("option", {
        value: c.name,
        children: c.name
      }, c.id))]
    }), /*#__PURE__*/_jsx(FormButton, {
      children: data.id ? 'Update' : 'Save'
    }), !data.id && /*#__PURE__*/_jsx("button", {
      type: "button",
      onClick: () => openModal('currency'),
      className: "text-fuchsia-400 hover:underline",
      children: "Add New Currency"
    })]
  });
};
const TransactionForm = ({
  data = {},
  wallets,
  categories,
  onSave,
  openModal
}) => {
  const [description, setDescription] = React.useState(data.description || '');
  const [amount, setAmount] = React.useState(data.amount || '');
  const [type, setType] = React.useState(data.type || 'expense');
  const [walletId, setWalletId] = React.useState(data.walletId || '');
  const [categoryId, setCategoryId] = React.useState(data.categoryId || '');
  const [date, setDate] = React.useState(data.date ? toDateTimeLocalString(data.date) : toDateTimeLocalString(new Date()));
  const [details, setDetails] = React.useState(data.details || '');
  const [attachment, setAttachment] = React.useState(null);
  const [error, setError] = React.useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Amount must be a valid number greater than 0.');
      return;
    }
    if (!walletId) {
      setError('Wallet is required.');
      return;
    }
    if (!categoryId) {
      setError('Category is required.');
      return;
    }
    if (!date) {
      setError('Date is required.');
      return;
    }
    let attachmentPath = data.attachment;
    if (attachment) {
      try {
        attachmentPath = await saveAttachment(attachment);
      } catch (e) {
        setError('Failed to save attachment.');
        return;
      }
    }
    const result = await onSave('transaction', {
      id: data.id,
      description: description.trim(),
      amount: Number(amount),
      type,
      walletId,
      categoryId,
      date: new Date(date),
      details: details.trim(),
      attachment: attachmentPath
    }, setError);
    if (!result.success) return;
  };
  return /*#__PURE__*/_jsxs("form", {
    onSubmit: handleSubmit,
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx("h3", {
      className: "text-xl font-bold text-white",
      children: data.id ? 'Edit Transaction' : 'Add Transaction'
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "text",
      value: description,
      onChange: e => setDescription(e.target.value),
      placeholder: "Description",
      error: error && error.includes('Description') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "number",
      value: amount,
      onChange: e => setAmount(e.target.value),
      placeholder: "Amount",
      error: error && error.includes('Amount') ? error : ''
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: type,
      onChange: e => setType(e.target.value),
      children: [/*#__PURE__*/_jsx("option", {
        value: "expense",
        children: "Expense"
      }), /*#__PURE__*/_jsx("option", {
        value: "income",
        children: "Income"
      })]
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: walletId,
      onChange: e => setWalletId(e.target.value),
      error: error && error.includes('Wallet') ? error : '',
      children: [/*#__PURE__*/_jsx("option", {
        value: "",
        children: "Select Wallet"
      }), wallets.map(w => /*#__PURE__*/_jsxs("option", {
        value: w.id,
        children: [w.name, " (", w.currency, ")"]
      }, w.id))]
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: categoryId,
      onChange: e => setCategoryId(e.target.value),
      error: error && error.includes('Category') ? error : '',
      children: [/*#__PURE__*/_jsx("option", {
        value: "",
        children: "Select Category"
      }), categories.filter(c => c.type === type).map(c => /*#__PURE__*/_jsx("option", {
        value: c.id,
        children: c.name
      }, c.id))]
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "datetime-local",
      value: date,
      onChange: e => setDate(e.target.value),
      error: error && error.includes('Date') ? error : ''
    }), /*#__PURE__*/_jsx(FormTextarea, {
      value: details,
      onChange: e => setDetails(e.target.value),
      placeholder: "Additional Details"
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "file",
      onChange: e => setAttachment(e.target.files[0]),
      accept: "image/*,.pdf"
    }), data.attachment && /*#__PURE__*/_jsxs("p", {
      className: "text-gray-400",
      children: ["Current attachment: ", data.attachment.split('/').pop()]
    }), /*#__PURE__*/_jsx(FormButton, {
      children: data.id ? 'Update' : 'Save'
    }), !data.id && /*#__PURE__*/_jsxs("div", {
      className: "space-y-2",
      children: [/*#__PURE__*/_jsx("button", {
        type: "button",
        onClick: () => openModal('wallet'),
        className: "text-fuchsia-400 hover:underline",
        children: "Add New Wallet"
      }), /*#__PURE__*/_jsx("button", {
        type: "button",
        onClick: () => openModal('category'),
        className: "text-fuchsia-400 hover:underline",
        children: "Add New Category"
      })]
    })]
  });
};
const CategoryForm = ({
  data = {},
  onSave
}) => {
  const [name, setName] = React.useState(data.name || '');
  const [icon, setIcon] = React.useState(data.icon || '💰');
  const [type, setType] = React.useState(data.type || 'expense');
  const [error, setError] = React.useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    const result = await onSave('category', {
      id: data.id,
      name: name.trim(),
      icon,
      type
    }, setError);
    if (!result.success) return;
  };
  return /*#__PURE__*/_jsxs("form", {
    onSubmit: handleSubmit,
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx("h3", {
      className: "text-xl font-bold text-white",
      children: data.id ? 'Edit Category' : 'Add Category'
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "text",
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Category Name",
      error: error
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "text",
      value: icon,
      onChange: e => setIcon(e.target.value),
      placeholder: "Icon (e.g., \uD83D\uDCB0)"
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: type,
      onChange: e => setType(e.target.value),
      children: [/*#__PURE__*/_jsx("option", {
        value: "expense",
        children: "Expense"
      }), /*#__PURE__*/_jsx("option", {
        value: "income",
        children: "Income"
      })]
    }), /*#__PURE__*/_jsx(FormButton, {
      children: data.id ? 'Update' : 'Save'
    })]
  });
};
const CurrencyForm = ({
  data = {},
  onSave
}) => {
  const [name, setName] = React.useState(data.name || '');
  const [error, setError] = React.useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Currency name is required.');
      return;
    }
    const result = await onSave('currency', {
      id: data.id,
      name: name.trim()
    }, setError);
    if (!result.success) return;
  };
  return /*#__PURE__*/_jsxs("form", {
    onSubmit: handleSubmit,
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx("h3", {
      className: "text-xl font-bold text-white",
      children: data.id ? 'Edit Currency' : 'Add Currency'
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "text",
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Currency Code (e.g., USD)",
      error: error
    }), /*#__PURE__*/_jsx(FormButton, {
      children: data.id ? 'Update' : 'Save'
    })]
  });
};
const BudgetForm = ({
  data = {},
  onSave,
  categories,
  currencies
}) => {
  var _currencies$2;
  const [name, setName] = React.useState(data.name || '');
  const [amount, setAmount] = React.useState(data.amount || '');
  const [categoryId, setCategoryId] = React.useState(data.categoryId || '');
  const [currency, setCurrency] = React.useState(data.currency || ((_currencies$2 = currencies[0]) === null || _currencies$2 === void 0 ? void 0 : _currencies$2.name) || '');
  const [startDate, setStartDate] = React.useState(data.startDate ? toDateString(data.startDate) : toDateString(new Date()));
  const [endDate, setEndDate] = React.useState(data.endDate ? toDateString(data.endDate) : '');
  const [error, setError] = React.useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Budget name is required.');
      return;
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Amount must be a valid number greater than 0.');
      return;
    }
    if (!categoryId) {
      setError('Category is required.');
      return;
    }
    if (!currency) {
      setError('Currency is required.');
      return;
    }
    if (!startDate) {
      setError('Start date is required.');
      return;
    }
    if (endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }
    const result = await onSave('budget', {
      id: data.id,
      name: name.trim(),
      amount: Number(amount),
      categoryId,
      currency,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null
    }, setError);
    if (!result.success) return;
  };
  return /*#__PURE__*/_jsxs("form", {
    onSubmit: handleSubmit,
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx("h3", {
      className: "text-xl font-bold text-white",
      children: data.id ? 'Edit Budget' : 'Add Budget'
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "text",
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Budget Name",
      error: error && error.includes('name') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "number",
      value: amount,
      onChange: e => setAmount(e.target.value),
      placeholder: "Amount",
      error: error && error.includes('Amount') ? error : ''
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: categoryId,
      onChange: e => setCategoryId(e.target.value),
      error: error && error.includes('Category') ? error : '',
      children: [/*#__PURE__*/_jsx("option", {
        value: "",
        children: "Select Category"
      }), categories.filter(c => c.type === 'expense').map(c => /*#__PURE__*/_jsx("option", {
        value: c.id,
        children: c.name
      }, c.id))]
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: currency,
      onChange: e => setCurrency(e.target.value),
      error: error && error.includes('Currency') ? error : '',
      children: [/*#__PURE__*/_jsx("option", {
        value: "",
        children: "Select Currency"
      }), currencies.map(c => /*#__PURE__*/_jsx("option", {
        value: c.name,
        children: c.name
      }, c.id))]
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "date",
      value: startDate,
      onChange: e => setStartDate(e.target.value),
      error: error && error.includes('date') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "date",
      value: endDate,
      onChange: e => setEndDate(e.target.value),
      placeholder: "End Date (optional)"
    }), /*#__PURE__*/_jsx(FormButton, {
      children: data.id ? 'Update' : 'Save'
    })]
  });
};
const DebtForm = ({
  data = {},
  onSave,
  currencies,
  wallets,
  balances,
  openModal
}) => {
  var _currencies$3;
  const [name, setName] = React.useState(data.name || '');
  const [person, setPerson] = React.useState(data.person || '');
  const [total, setTotal] = React.useState(data.total || '');
  const [paid, setPaid] = React.useState(data.paid || 0);
  const [type, setType] = React.useState(data.type || 'owedByMe');
  const [currency, setCurrency] = React.useState(data.currency || ((_currencies$3 = currencies[0]) === null || _currencies$3 === void 0 ? void 0 : _currencies$3.name) || '');
  const [date, setDate] = React.useState(data.date ? toDateString(data.date) : toDateString(new Date()));
  const [deadline, setDeadline] = React.useState(data.deadline ? toDateString(data.deadline) : '');
  const [details, setDetails] = React.useState(data.details || '');
  const [attachment, setAttachment] = React.useState(null);
  const [createTransaction, setCreateTransaction] = React.useState({
    enabled: !data.id,
    walletId: ''
  });
  const [error, setError] = React.useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Debt name is required.');
      return;
    }
    if (!person.trim()) {
      setError('Person name is required.');
      return;
    }
    if (!total || isNaN(total) || total <= 0) {
      setError('Total amount must be a valid number greater than 0.');
      return;
    }
    if (isNaN(paid) || paid < 0 || paid > total) {
      setError('Paid amount must be a valid number between 0 and total.');
      return;
    }
    if (!currency) {
      setError('Currency is required.');
      return;
    }
    if (!date) {
      setError('Date is required.');
      return;
    }
    if (deadline && new Date(deadline) < new Date(date)) {
      setError('Deadline cannot be before date.');
      return;
    }
    let attachmentPath = data.attachment;
    if (attachment) {
      try {
        attachmentPath = await saveAttachment(attachment);
      } catch (e) {
        setError('Failed to save attachment.');
        return;
      }
    }
    const result = await onSave({
      id: data.id,
      name: name.trim(),
      person: person.trim(),
      total: Number(total),
      paid: Number(paid),
      type,
      currency,
      date: new Date(date),
      deadline: deadline ? new Date(deadline) : null,
      details: details.trim(),
      attachment: attachmentPath
    }, createTransaction, setError);
    if (!result.success) return;
  };
  return /*#__PURE__*/_jsxs("form", {
    onSubmit: handleSubmit,
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx("h3", {
      className: "text-xl font-bold text-white",
      children: data.id ? 'Edit Debt' : 'Add Debt'
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "text",
      value: name,
      onChange: e => setName(e.target.value),
      placeholder: "Debt Name",
      error: error && error.includes('name') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "text",
      value: person,
      onChange: e => setPerson(e.target.value),
      placeholder: "Person",
      error: error && error.includes('Person') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "number",
      value: total,
      onChange: e => setTotal(e.target.value),
      placeholder: "Total Amount",
      error: error && error.includes('amount') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "number",
      value: paid,
      onChange: e => setPaid(e.target.value),
      placeholder: "Amount Paid",
      error: error && error.includes('Paid') ? error : ''
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: type,
      onChange: e => setType(e.target.value),
      children: [/*#__PURE__*/_jsx("option", {
        value: "owedByMe",
        children: "Owed by Me"
      }), /*#__PURE__*/_jsx("option", {
        value: "owedToMe",
        children: "Owed to Me"
      })]
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: currency,
      onChange: e => setCurrency(e.target.value),
      error: error && error.includes('Currency') ? error : '',
      children: [/*#__PURE__*/_jsx("option", {
        value: "",
        children: "Select Currency"
      }), currencies.map(c => /*#__PURE__*/_jsx("option", {
        value: c.name,
        children: c.name
      }, c.id))]
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "date",
      value: date,
      onChange: e => setDate(e.target.value),
      error: error && error.includes('Date') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "date",
      value: deadline,
      onChange: e => setDeadline(e.target.value),
      placeholder: "Deadline (optional)"
    }), /*#__PURE__*/_jsx(FormTextarea, {
      value: details,
      onChange: e => setDetails(e.target.value),
      placeholder: "Additional Details"
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "file",
      onChange: e => setAttachment(e.target.files[0]),
      accept: "image/*,.pdf"
    }), data.attachment && /*#__PURE__*/_jsxs("p", {
      className: "text-gray-400",
      children: ["Current attachment: ", data.attachment.split('/').pop()]
    }), !data.id && /*#__PURE__*/_jsxs("div", {
      className: "space-y-2",
      children: [/*#__PURE__*/_jsxs("label", {
        className: "flex items-center space-x-2 text-gray-300",
        children: [/*#__PURE__*/_jsx("input", {
          type: "checkbox",
          checked: createTransaction.enabled,
          onChange: e => setCreateTransaction(prev => ({
            ...prev,
            enabled: e.target.checked
          }))
        }), /*#__PURE__*/_jsx("span", {
          children: "Create associated transaction"
        })]
      }), createTransaction.enabled && /*#__PURE__*/_jsxs(FormSelect, {
        value: createTransaction.walletId,
        onChange: e => setCreateTransaction(prev => ({
          ...prev,
          walletId: e.target.value
        })),
        error: error && error.includes('wallet') ? error : '',
        children: [/*#__PURE__*/_jsx("option", {
          value: "",
          children: "Select Wallet"
        }), wallets.filter(w => w.currency === currency).map(w => /*#__PURE__*/_jsxs("option", {
          value: w.id,
          children: [w.name, " (Balance: ", balances[w.id] || 0, " ", w.currency, ")"]
        }, w.id))]
      }), /*#__PURE__*/_jsx("button", {
        type: "button",
        onClick: () => openModal('currency'),
        className: "text-fuchsia-400 hover:underline",
        children: "Add New Currency"
      })]
    }), /*#__PURE__*/_jsx(FormButton, {
      children: data.id ? 'Update' : 'Save'
    })]
  });
};
const DebtPaymentForm = ({
  debts,
  wallets,
  balances,
  onSave
}) => {
  const [debtId, setDebtId] = React.useState('');
  const [walletId, setWalletId] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(toDateTimeLocalString(new Date()));
  const [error, setError] = React.useState('');
  const selectedDebt = debts.find(d => d.id === debtId);
  const compatibleWallets = wallets.filter(w => selectedDebt ? w.currency === selectedDebt.currency : true);
  const handleSubmit = async e => {
    e.preventDefault();
    if (!debtId) {
      setError('Debt is required.');
      return;
    }
    if (!walletId) {
      setError('Wallet is required.');
      return;
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Amount must be a valid number greater than 0.');
      return;
    }
    if (!date) {
      setError('Date is required.');
      return;
    }
    const result = await onSave({
      debtId,
      walletId,
      amount: Number(amount),
      date: new Date(date)
    }, setError);
    if (!result.success) return;
  };
  return /*#__PURE__*/_jsxs("form", {
    onSubmit: handleSubmit,
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx("h3", {
      className: "text-xl font-bold text-white",
      children: "Record Debt Payment"
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: debtId,
      onChange: e => {
        setDebtId(e.target.value);
        setWalletId('');
      },
      error: error && error.includes('Debt') ? error : '',
      children: [/*#__PURE__*/_jsx("option", {
        value: "",
        children: "Select Debt"
      }), debts.filter(d => d.paid < d.total).map(d => /*#__PURE__*/_jsxs("option", {
        value: d.id,
        children: [d.name, " (", d.person, ", ", d.total - d.paid, " ", d.currency, " remaining)"]
      }, d.id))]
    }), /*#__PURE__*/_jsxs(FormSelect, {
      value: walletId,
      onChange: e => setWalletId(e.target.value),
      error: error && error.includes('Wallet') ? error : '',
      children: [/*#__PURE__*/_jsx("option", {
        value: "",
        children: "Select Wallet"
      }), compatibleWallets.map(w => /*#__PURE__*/_jsxs("option", {
        value: w.id,
        children: [w.name, " (Balance: ", balances[w.id] || 0, " ", w.currency, ")"]
      }, w.id))]
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "number",
      value: amount,
      onChange: e => setAmount(e.target.value),
      placeholder: "Payment Amount",
      error: error && error.includes('Amount') ? error : ''
    }), /*#__PURE__*/_jsx(FormInput, {
      type: "datetime-local",
      value: date,
      onChange: e => setDate(e.target.value),
      error: error && error.includes('Date') ? error : ''
    }), /*#__PURE__*/_jsx(FormButton, {
      children: "Record Payment"
    })]
  });
};
