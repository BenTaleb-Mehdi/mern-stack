import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◉' },
  { to: '/form', label: 'Client Form', icon: '◇' },
  { to: '/table', label: 'Tableau Informations', icon: '☰' },
];

function handleLogout() {
  localStorage.removeItem('adminToken');
  window.location.href = '/';
}

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}>CP</div>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? 'var(--primary-bg)' : 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={styles.logoutSection}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span style={styles.navIcon}>⏻</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    background: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--border)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
  },
  brand: {
    height: 'var(--navbar-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid var(--border)',
  },
  brandIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '-1px',
  },
  nav: {
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: 'var(--radius-sm)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.15s ease',
  },
  navIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  logoutSection: {
    padding: '12px',
    borderTop: '1px solid var(--border)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'transparent',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.15s ease',
  },
};
