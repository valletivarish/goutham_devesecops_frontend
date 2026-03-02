import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaExchangeAlt,
  FaWallet,
  FaTags,
  FaBullseye,
  FaChartLine,
} from 'react-icons/fa';

const sidebarStyles = {
  sidebar: {
    width: '220px',
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    paddingTop: '20px',
    position: 'fixed',
    top: '60px',
    left: 0,
    bottom: 0,
    overflowY: 'auto',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '0 12px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  activeLink: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontWeight: '600',
  },
};

const navItems = [
  { to: '/dashboard', icon: FaHome, label: 'Dashboard' },
  { to: '/transactions', icon: FaExchangeAlt, label: 'Transactions' },
  { to: '/budgets', icon: FaWallet, label: 'Budgets' },
  { to: '/categories', icon: FaTags, label: 'Categories' },
  { to: '/goals', icon: FaBullseye, label: 'Goals' },
  { to: '/forecast', icon: FaChartLine, label: 'Forecast' },
];

const Sidebar = () => {
  return (
    <aside style={sidebarStyles.sidebar}>
      <nav style={sidebarStyles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...sidebarStyles.link,
              ...(isActive ? sidebarStyles.activeLink : {}),
            })}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
