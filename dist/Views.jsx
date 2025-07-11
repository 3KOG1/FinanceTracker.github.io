const ProfileView = ({ openModal }) => {
    const handleExport = async () => {
        const result = await exportData();
        if (!result.success) {
            openModal('error', { message: result.message });
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const result = await importData(file);
        if (!result.success) {
            openModal('error', { message: result.message });
        } else {
            openModal('error', { message: result.message }); // Suggest reload
        }
    };

    return (
        <Page title="Profile">
            <GlassCard>
                <h3 className="text-lg font-semibold text-white">User Profile</h3>
                <p className="text-gray-300">Offline Mode: Data is stored locally on your device.</p>
                <p className="text-gray-400 mt-2">Manage your financial data securely without an internet connection.</p>
                <div className="mt-4 space-y-4">
                    <FormButton onClick={handleExport}>Export Data</FormButton>
                    <div>
                        <label className="text-fuchsia-400 hover:underline cursor-pointer">
                            Import Data
                            <input
                                type="file"
                                accept=".zip"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </GlassCard>
        </Page>
    );
};