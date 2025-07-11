import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const Sidebar = ({
  activeView,
  setActiveView,
  isOpen,
  setIsOpen
}) => {
  const navItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    Icon: DashboardIcon
  }, {
    id: 'money',
    label: 'Wallets',
    Icon: WalletIcon
  }, {
    id: 'ledger',
    label: 'Ledger',
    Icon: LedgerIcon
  }, {
    id: 'calendar',
    label: 'Calendar',
    Icon: CalendarIcon
  }, {
    id: 'parameters',
    label: 'Parameters',
    Icon: ParametersIcon
  }, {
    id: 'profile',
    label: 'Profile',
    Icon: ProfileIcon
  }];
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      onClick: () => setIsOpen(false),
      className: `fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
    }), /*#__PURE__*/_jsxs("aside", {
      className: `fixed top-0 left-0 h-full w-64 bg-slate-800/80 backdrop-blur-lg p-6 flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`,
      children: [/*#__PURE__*/_jsx("h1", {
        className: "text-2xl font-bold text-white mb-10",
        children: "Finance Tracker"
      }), /*#__PURE__*/_jsx("nav", {
        className: "flex flex-col space-y-2",
        children: navItems.map(item => /*#__PURE__*/_jsx(NavItem, {
          id: item.id,
          label: item.label,
          Icon: item.Icon,
          activeView: activeView,
          setActiveView: setActiveView
        }, item.id))
      })]
    })]
  });
};
const NavItem = ({
  id,
  label,
  Icon,
  activeView,
  setActiveView
}) => {
  const isActive = activeView === id;
  return /*#__PURE__*/_jsxs("button", {
    onClick: () => setActiveView(id),
    className: `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30' : 'text-gray-400 hover:bg-white/10'}`,
    children: [/*#__PURE__*/_jsx(Icon, {
      className: "w-6 h-6"
    }), /*#__PURE__*/_jsx("span", {
      className: "font-semibold",
      children: label
    })]
  });
};
