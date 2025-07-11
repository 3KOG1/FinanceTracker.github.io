import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ProfileView = ({
  openModal
}) => {
  const handleExport = async () => {
    const result = await exportData();
    if (!result.success) {
      openModal('error', {
        message: result.message
      });
    }
  };
  const handleImport = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await importData(file);
    if (!result.success) {
      openModal('error', {
        message: result.message
      });
    } else {
      openModal('error', {
        message: result.message
      }); // Suggest reload
    }
  };
  return /*#__PURE__*/_jsx(Page, {
    title: "Profile",
    children: /*#__PURE__*/_jsxs(GlassCard, {
      children: [/*#__PURE__*/_jsx("h3", {
        className: "text-lg font-semibold text-white",
        children: "User Profile"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-gray-300",
        children: "Offline Mode: Data is stored locally on your device."
      }), /*#__PURE__*/_jsx("p", {
        className: "text-gray-400 mt-2",
        children: "Manage your financial data securely without an internet connection."
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-4 space-y-4",
        children: [/*#__PURE__*/_jsx(FormButton, {
          onClick: handleExport,
          children: "Export Data"
        }), /*#__PURE__*/_jsx("div", {
          children: /*#__PURE__*/_jsxs("label", {
            className: "text-fuchsia-400 hover:underline cursor-pointer",
            children: ["Import Data", /*#__PURE__*/_jsx("input", {
              type: "file",
              accept: ".zip",
              onChange: handleImport,
              className: "hidden"
            })]
          })
        })]
      })]
    })
  });
};
