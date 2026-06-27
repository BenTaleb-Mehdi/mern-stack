import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <Navbar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    marginLeft: 'var(--sidebar-width)',
    marginTop: 'var(--navbar-height)',
    flex: 1,
    padding: '28px 32px',
    background: 'var(--bg)',
    minHeight: 'calc(100vh - var(--navbar-height))',
  },
};
