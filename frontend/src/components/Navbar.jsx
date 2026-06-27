import { useLocation } from 'react-router-dom';

const pages = {
  '/': 'Dashboard',
  '/form': 'Client Form',
  '/table': 'Client Table',
};

export default function Navbar() {
  const location = useLocation();
  const pageName = pages[location.pathname] || 'Dashboard';

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.logo}>ClientPro</h1>
        <span style={styles.separator}>|</span>
        <span style={styles.pageName}>{pageName}</span>
      </div>
      <div style={styles.right}>
        <div style={styles.avatar}>A</div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 'var(--navbar-height)',
    background: 'var(--navbar-bg)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    position: 'fixed',
    top: 0,
    left: 'var(--sidebar-width)',
    right: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--primary)',
    letterSpacing: '-0.5px',
  },
  separator: {
    color: 'var(--border)',
    fontSize: '18px',
  },
  pageName: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
