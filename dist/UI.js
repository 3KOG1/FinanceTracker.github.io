import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Page = ({
  title,
  children,
  actionButton
}) => /*#__PURE__*/_jsxs("div", {
  className: "p-4 md:p-8 animate-fade-in",
  children: [/*#__PURE__*/_jsxs("div", {
    className: "flex justify-between items-center mb-6",
    children: [/*#__PURE__*/_jsx("h1", {
      className: "text-3xl font-bold text-white",
      children: title
    }), actionButton]
  }), children]
});
const GlassCard = ({
  children,
  padding = "p-4",
  extraClasses = ""
}) => /*#__PURE__*/_jsx("div", {
  className: `relative bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 ${padding} ${extraClasses}`,
  children: children
});
const Modal = ({
  isOpen,
  onClose,
  children,
  isSubModal
}) => {
  React.useEffect(() => {
    const handleEsc = e => {
      if (e.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  const alignmentClasses = isSubModal ? 'items-center' : 'items-end';
  const containerClasses = isSubModal ? 'bg-slate-700 rounded-2xl border-2 border-amber-500' : 'bg-slate-800 rounded-t-2xl border-t-2 border-fuchsia-500';
  const animationClasses = isSubModal ? isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0' : isOpen ? 'translate-y-0' : 'translate-y-full';
  return /*#__PURE__*/_jsxs("div", {
    className: `fixed inset-0 z-50 flex justify-center p-4 transition-opacity duration-300 ${alignmentClasses} ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
    style: {
      zIndex: 50 + (isSubModal ? 5 : 0)
    },
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 bg-black/70",
      onClick: onClose
    }), /*#__PURE__*/_jsx("div", {
      className: `${containerClasses} shadow-2xl w-full max-w-md z-10 transition-all duration-300 ${animationClasses}`,
      children: /*#__PURE__*/_jsxs("div", {
        className: "p-6 relative",
        children: [/*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "absolute top-4 right-4 text-gray-500 hover:text-white",
          children: /*#__PURE__*/_jsx(CloseIcon, {})
        }), children]
      })
    })]
  });
};
const ConfirmDeleteModal = ({
  type,
  name,
  onConfirm,
  onCancel
}) => {
  const [error, setError] = React.useState('');
  const handleConfirm = async () => {
    const result = await onConfirm(setError);
    if (result !== null && result !== void 0 && result.success) {
      onCancel();
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-4",
    children: [/*#__PURE__*/_jsx("h3", {
      className: "text-xl font-bold text-white",
      children: "Confirm Delete"
    }), /*#__PURE__*/_jsxs("p", {
      className: "text-gray-300",
      children: ["Are you sure you want to delete ", type, " \"", name, "\"?"]
    }), error && /*#__PURE__*/_jsx("p", {
      className: "error-text",
      children: error
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex space-x-4",
      children: [/*#__PURE__*/_jsx(FormButton, {
        onClick: handleConfirm,
        children: "Delete"
      }), /*#__PURE__*/_jsx(FormButton, {
        onClick: onCancel,
        className: "bg-gray-600 hover:bg-gray-700",
        children: "Cancel"
      })]
    })]
  });
};
const ErrorModal = ({
  message
}) => /*#__PURE__*/_jsxs("div", {
  className: "space-y-4",
  children: [/*#__PURE__*/_jsx("h3", {
    className: "text-xl font-bold text-white",
    children: "Error"
  }), /*#__PURE__*/_jsx("p", {
    className: "error-text",
    children: message
  }), /*#__PURE__*/_jsx(FormButton, {
    onClick: () => window.location.reload(),
    children: "Retry"
  })]
});
const FormInput = ({
  error,
  ...props
}) => /*#__PURE__*/_jsxs("div", {
  children: [/*#__PURE__*/_jsx("input", {
    ...props,
    className: `w-full p-3 bg-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border ${error ? 'border-red-400' : 'border-slate-600'}`
  }), error && /*#__PURE__*/_jsx("p", {
    className: "error-text mt-1",
    children: error
  })]
});
const FormTextarea = ({
  error,
  ...props
}) => /*#__PURE__*/_jsxs("div", {
  children: [/*#__PURE__*/_jsx("textarea", {
    ...props,
    rows: "3",
    className: `w-full p-3 bg-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border ${error ? 'border-red-400' : 'border-slate-600'}`
  }), error && /*#__PURE__*/_jsx("p", {
    className: "error-text mt-1",
    children: error
  })]
});
const FormSelect = ({
  error,
  ...props
}) => /*#__PURE__*/_jsxs("div", {
  children: [/*#__PURE__*/_jsx("select", {
    ...props,
    className: `w-full p-3 bg-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border ${error ? 'border-red-400' : 'border-slate-600'}`
  }), error && /*#__PURE__*/_jsx("p", {
    className: "error-text mt-1",
    children: error
  })]
});
const FormButton = ({
  className = "bg-fuchsia-500 hover:bg-fuchsia-600",
  children,
  ...props
}) => /*#__PURE__*/_jsx("button", {
  ...props,
  className: `w-full p-3 ${className} rounded-xl text-white font-bold transition disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-fuchsia-500/30`,
  children: children
});
