import { useClientContext } from '../context/ClientContext';
export default function DashboardPage() {
  const { clients } = useClientContext();
  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard</h2>
        <p style={styles.subtitle}>Vue d'ensemble des clients</p>
      </div>

    </div>
  );
}

const styles = {
  header: {
  rRadius: 'var(--radius)',
    padding: '20px',
    border: '1px solid var(--border)',
    minWidth: '300px',
  },
  chartTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: '16px',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
};
