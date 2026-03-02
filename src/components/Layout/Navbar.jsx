import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaUserCircle, FaChartPie } from 'react-icons/fa';

const navStyles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: '0 24px',
    height: '60px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#fff',
    fontSize: '20px',
    fontWeight: '700',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#cbd5e1',
    fontSize: '14px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: 'transparent',
    color: '#f87171',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav style={navStyles.navbar}>
      <Link to="/" style={navStyles.brand}>
        <FaChartPie size={24} color="#3b82f6" />
        Finance Tracker
      </Link>

      {isAuthenticated && (
        <ul style={navStyles.navLinks}>
          <li><Link to="/dashboard" style={navStyles.navLink}>Dashboard</Link></li>
          <li><Link to="/transactions" style={navStyles.navLink}>Transactions</Link></li>
          <li><Link to="/budgets" style={navStyles.navLink}>Budgets</Link></li>
          <li><Link to="/categories" style={navStyles.navLink}>Categories</Link></li>
          <li><Link to="/goals" style={navStyles.navLink}>Goals</Link></li>
          <li><Link to="/forecast" style={navStyles.navLink}>Forecast</Link></li>
        </ul>
      )}

      <div style={navStyles.userSection}>
        {isAuthenticated ? (
          <>
            <span style={navStyles.username}>
              <FaUserCircle size={18} />
              {user?.username || 'User'}
            </span>
            <button style={navStyles.logoutBtn} onClick={logout}>
              <FaSignOutAlt size={14} />
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={navStyles.navLink}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
