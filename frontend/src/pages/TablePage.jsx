import ClientTable from '../components/ClientTable';

export default function TablePage() {
  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Tableau Informations</h2>
        <p style={styles.subtitle}>Liste complète des clients enregistrés</p>
      </div>
      <div style={styles.card}>
        <ClientTable />
      </div>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  card: {
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    border: '1px solid var(--border)',
  },
};
