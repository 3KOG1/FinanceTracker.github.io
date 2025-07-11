const LENDING_CATEGORY = 'Lending';
const DEBT_PAYMENT_CATEGORY = 'Debt Payments';

const DEFAULT_CATEGORIES = [
    { id: generateUUID(), name: 'Salary', icon: '💼', type: 'income' },
    { id: generateUUID(), name: 'Food & Dining', icon: '🍔', type: 'expense' },
    { id: generateUUID(), name: 'Transportation', icon: '🚗', type: 'expense' },
    { id: generateUUID(), name: 'Shopping', icon: '🛒', type: 'expense' },
    { id: generateUUID(), name: 'Debt Payments', icon: '💳', type: 'expense' },
    { id: generateUUID(), name: 'Lending', icon: '💸', type: 'expense' },
];

const DEFAULT_CURRENCIES = [
    { id: generateUUID(), name: 'USD' },
    { id: generateUUID(), name: 'EUR' },
];

const COLLECTION_PATH = (collectionName) => `${collectionName}.json`;

const DashboardIcon = ({ className }) => React.createElement('svg', {
    className,
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('path', { d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', key: 'path1' }),
    React.createElement('polyline', { points: '9 22 9 12 15 12 15 22', key: 'polyline1' })
]);

const WalletIcon = ({ className }) => React.createElement('svg', {
    className,
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('path', { d: 'M21 12V7H5a2 2 0 0 1 0-4h14v4', key: 'path1' }),
    React.createElement('path', { d: 'M3 5v14a2 2 0 0 0 2 2h16v-5h-2.43a1 1 0 0 1-.94-.66l-.86-2.68a1 1 0 0 1 .94-1.34H21V5Z', key: 'path2' })
]);

const LedgerIcon = ({ className }) => React.createElement('svg', {
    className,
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('path', { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', key: 'path1' }),
    React.createElement('path', { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', key: 'path2' })
]);

const CalendarIcon = ({ className }) => React.createElement('svg', {
    className,
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2', key: 'rect1' }),
    React.createElement('line', { x1: '16', y1: '2', x2: '16', y2: '6', key: 'line1' }),
    React.createElement('line', { x1: '8', y1: '2', x2: '8', y2: '6', key: 'line2' }),
    React.createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10', key: 'line3' })
]);

const ParametersIcon = ({ className }) => React.createElement('svg', {
    className,
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('circle', { cx: '12', cy: '12', r: '3', key: 'circle1' }),
    React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z', key: 'path1' })
]);

const ProfileIcon = ({ className }) => React.createElement('svg', {
    className,
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', key: 'path1' }),
    React.createElement('circle', { cx: '12', cy: '7', r: '4', key: 'circle1' })
]);

const PlusIcon = () => React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '3',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('line', { x1: '12', y1: '5', x2: '12', y2: '19', key: 'line1' }),
    React.createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12', key: 'line2' })
]);

const TrashIcon = () => React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('polyline', { points: '3 6 5 6 21 6', key: 'polyline1' }),
    React.createElement('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', key: 'path1' })
]);

const EditIcon = () => React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', key: 'path1' }),
    React.createElement('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', key: 'path2' })
]);

const CloseIcon = () => React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18', key: 'line1' }),
    React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18', key: 'line2' })
]);

const MenuIcon = () => React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
}, [
    React.createElement('line', { x1: '4', x2: '20', y1: '12', y2: '12', key: 'line1' }),
    React.createElement('line', { x1: '4', x2: '20', y1: '6', y2: '6', key: 'line2' }),
    React.createElement('line', { x1: '4', x2: '20', y1: '18', y2: '18', key: 'line3' })
]);

function formatDateTime(date) {
    return date ? new Date(date).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
}

function toDateTimeLocalString(date) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
}

function toDateString(date) {
    return new Date(date).toISOString().split('T')[0];
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

let directoryHandle = null;

async function initializeStorage() {
    if (!window.showDirectoryPicker) {
        throw new Error('File System Access API is not supported in this browser.');
    }
    try {
        directoryHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        const collections = ['wallets', 'categories', 'transactions', 'debts', 'currencies', 'budgets'];
        for (const collection of collections) {
            const filePath = COLLECTION_PATH(collection);
            try {
                const fileHandle = await directoryHandle.getFileHandle(filePath, { create: true });
                const file = await fileHandle.getFile();
                const text = await file.text();
                if (!text.trim()) {
                    if (collection === 'categories') {
                        await writeFile(fileHandle, JSON.stringify(DEFAULT_CATEGORIES, null, 2));
                    } else if (collection === 'currencies') {
                        await writeFile(fileHandle, JSON.stringify(DEFAULT_CURRENCIES, null, 2));
                    } else {
                        await writeFile(fileHandle, JSON.stringify([], null, 2));
                    }
                }
            } catch (e) {
                console.error(`Error initializing ${collection} file:`, e);
            }
        }
        const attachmentsDir = await directoryHandle.getDirectoryHandle('attachments', { create: true });
    } catch (e) {
        console.error('Error accessing directory:', e);
        throw new Error('Failed to initialize storage. Please try again.');
    }
}

async function readCollection(collectionName) {
    if (!directoryHandle) {
        throw new Error('Storage not initialized.');
    }
    try {
        const fileHandle = await directoryHandle.getFileHandle(COLLECTION_PATH(collectionName), { create: true });
        const file = await fileHandle.getFile();
        const text = await file.text();
        const data = text ? JSON.parse(text) : [];
        return data.map(item => ({
            ...item,
            ...(item.date ? { date: new Date(item.date) } : {}),
            ...(item.deadline ? { deadline: new Date(item.deadline) } : {}),
            ...(item.createdAt ? { createdAt: new Date(item.createdAt) } : {}),
            ...(item.appliesOn ? { appliesOn: new Date(item.appliesOn) } : {}),
            ...(item.startDate ? { startDate: new Date(item.startDate) } : {}),
            ...(item.endDate ? { endDate: new Date(item.endDate) } : {})
        }));
    } catch (e) {
        console.error(`Error reading ${collectionName}:`, e);
        return [];
    }
}

async function writeCollection(collectionName, data) {
    if (!directoryHandle) {
        throw new Error('Storage not initialized.');
    }
    try {
        const fileHandle = await directoryHandle.getFileHandle(COLLECTION_PATH(collectionName), { create: true });
        await writeFile(fileHandle, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error writing ${collectionName}:`, e);
        throw new Error(`Failed to save ${collectionName}.`);
    }
}

async function writeFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}

async function saveAttachment(file) {
    if (!directoryHandle) {
        throw new Error('Storage not initialized.');
    }
    try {
        const attachmentsDir = await directoryHandle.getDirectoryHandle('attachments', { create: true });
        const fileName = `${generateUUID()}_${file.name}`;
        const fileHandle = await attachmentsDir.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();
        return `attachments/${fileName}`;
    } catch (e) {
        console.error('Error saving attachment:', e);
        throw new Error('Failed to save attachment.');
    }
}

async function deleteAttachment(filePath) {
    if (!directoryHandle || !filePath) return;
    try {
        const attachmentsDir = await directoryHandle.getDirectoryHandle('attachments', { create: true });
        const fileName = filePath.split('/').pop();
        await attachmentsDir.removeEntry(fileName);
    } catch (e) {
        console.error('Error deleting attachment:', e);
    }
}
