const exportData = async () => {
    try {
        if (!window.directoryHandle) {
            throw new Error('Storage not initialized.');
        }
        const zip = new JSZip();
        const collections = ['wallets', 'categories', 'transactions', 'debts', 'currencies', 'budgets'];

        // Export JSON files
        for (const collection of collections) {
            const fileHandle = await window.directoryHandle.getFileHandle(`${collection}.json`, { create: false });
            const file = await fileHandle.getFile();
            const text = await file.text();
            zip.file(`data/${collection}.json`, text);
        }

        // Export attachments
        const attachmentsDir = await window.directoryHandle.getDirectoryHandle('attachments', { create: false });
        for await (const entry of attachmentsDir.values()) {
            if (entry.kind === 'file') {
                const file = await entry.getFile();
                const arrayBuffer = await file.arrayBuffer();
                zip.file(`data/attachments/${file.name}`, arrayBuffer);
            }
        }

        // Generate ZIP and trigger download
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-tracker-backup-${new Date().toISOString().split('T')[0]}.zip`;
        a.click();
        URL.revokeObjectURL(url);
        return { success: true, message: 'Backup exported successfully.' };
    } catch (e) {
        console.error('Error exporting data:', e);
        return { success: false, message: 'Failed to export data. Please try again.' };
    }
};

const importData = async (zipFile) => {
    try {
        if (!window.directoryHandle) {
            throw new Error('Storage not initialized.');
        }
        const zip = new JSZip();
        await zip.loadAsync(zipFile);

        // Import JSON files
        const collections = ['wallets', 'categories', 'transactions', 'debts', 'currencies', 'budgets'];
        for (const collection of collections) {
            const filePath = `data/${collection}.json`;
            if (zip.file(filePath)) {
                const text = await zip.file(filePath).async('text');
                const fileHandle = await window.directoryHandle.getFileHandle(`${collection}.json`, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(text);
                await writable.close();
            }
        }

        // Import attachments
        const attachmentsDir = await window.directoryHandle.getDirectoryHandle('attachments', { create: true });
        for (const filePath in zip.files) {
            if (filePath.startsWith('data/attachments/') && !zip.files[filePath].dir) {
                const fileName = filePath.split('/').pop();
                const arrayBuffer = await zip.files[filePath].async('arraybuffer');
                const fileHandle = await attachmentsDir.getFileHandle(fileName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(arrayBuffer);
                await writable.close();
            }
        }

        return { success: true, message: 'Backup imported successfully. Please reload the app.' };
    } catch (e) {
        console.error('Error importing data:', e);
        return { success: false, message: 'Failed to import data. Please ensure the ZIP file is valid.' };
    }
};
