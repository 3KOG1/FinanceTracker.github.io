const Page = ({ title, children, actionButton }) => (
    <div className="p-4 md:p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {actionButton}
        </div>
        {children}
    </div>
);

const GlassCard = ({ children, padding = "p-4", extraClasses = "" }) => (
    <div className={`relative bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 ${padding} ${extraClasses}`}>
        {children}
    </div>
);

const Modal = ({ isOpen, onClose, children, isSubModal }) => {
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const alignmentClasses = isSubModal ? 'items-center' : 'items-end';
    const containerClasses = isSubModal ? 'bg-slate-700 rounded-2xl border-2 border-amber-500' : 'bg-slate-800 rounded-t-2xl border-t-2 border-fuchsia-500';
    const animationClasses = isSubModal ? (isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0') : (isOpen ? 'translate-y-0' : 'translate-y-full');

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-center p-4 transition-opacity duration-300 ${alignmentClasses} ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ zIndex: 50 + (isSubModal ? 5 : 0) }}
        >
            <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
            <div className={`${containerClasses} shadow-2xl w-full max-w-md z-10 transition-all duration-300 ${animationClasses}`}>
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                        <CloseIcon />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

const ConfirmDeleteModal = ({ type, name, onConfirm, onCancel }) => {
    const [error, setError] = React.useState('');

    const handleConfirm = async () => {
        const result = await onConfirm(setError);
        if (result?.success) {
            onCancel();
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
            <p className="text-gray-300">Are you sure you want to delete {type} "{name}"?</p>
            {error && <p className="error-text">{error}</p>}
            <div className="flex space-x-4">
                <FormButton onClick={handleConfirm}>Delete</FormButton>
                <FormButton onClick={onCancel} className="bg-gray-600 hover:bg-gray-700">Cancel</FormButton>
            </div>
        </div>
    );
};

const ErrorModal = ({ message }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Error</h3>
        <p className="error-text">{message}</p>
        <FormButton onClick={() => window.location.reload()}>Retry</FormButton>
    </div>
);

const FormInput = ({ error, ...props }) => (
    <div>
        <input
            {...props}
            className={`w-full p-3 bg-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border ${
                error ? 'border-red-400' : 'border-slate-600'
            }`}
        />
        {error && <p className="error-text mt-1">{error}</p>}
    </div>
);

const FormTextarea = ({ error, ...props }) => (
    <div>
        <textarea
            {...props}
            rows="3"
            className={`w-full p-3 bg-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border ${
                error ? 'border-red-400' : 'border-slate-600'
            }`}
        />
        {error && <p className="error-text mt-1">{error}</p>}
    </div>
);

const FormSelect = ({ error, ...props }) => (
    <div>
        <select
            {...props}
            className={`w-full p-3 bg-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border ${
                error ? 'border-red-400' : 'border-slate-600'
            }`}
        />
        {error && <p className="error-text mt-1">{error}</p>}
    </div>
);

const FormButton = ({ className = "bg-fuchsia-500 hover:bg-fuchsia-600", children, ...props }) => (
    <button
        {...props}
        className={`w-full p-3 ${className} rounded-xl text-white font-bold transition disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-fuchsia-500/30`}
    >
        {children}
    </button>
);