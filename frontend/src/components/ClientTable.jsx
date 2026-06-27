import { useNavigate } from 'react-router-dom';
import { useClientContext } from '../context/ClientContext';

export default function ClientTable() {
  const { clients, loading, error, deleteClient } = useClientContext();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={styles.empty}>
        <div style={styles.spinner} />
        <p>Chargement des clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.empty, color: '#dc2626' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyIcon}>📋</p>
        <p style={styles.emptyText}>Aucun client enregistr</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Tlphone</th>
            <th style={styles.th}>Description</th>
            <th style={{ ...styles.th, textAlign: 'center', width: '140px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} style={styles.tr}>
              <td style={styles.td}>{client.name}</td>
              <td style={styles.td}>{client.phone}</td>
              <td style={{ ...styles.td, color: client.description ? 'var(--text)' : 'var(--text-secondary)' }}>
                {client.description || '\u2014'}
              </td>
              <td style={{ ...styles.td, textAlign: 'center' }}>
                <button
                  onClick={() => navigate('/form', { state: { editingClient: client } })}
                  style={styles.editBtn}
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Confirmer la suppression ?')) {
                      deleteClient(client.id);
                    }
                  }}
                  style={styles.deleteBtn}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid var(--border)',
    background: 'var(--bg)',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.1s ease',
  },
  td: {
    padding: '14px 16px',
    color: 'var(--text)',
  },
  editBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    marginRight: '8px',
  },
  deleteBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #fca5a5',
    background: '#fef2f2',
    color: '#dc2626',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)',
    gap: '12px',
  },
  emptyIcon: {
    fontSize: '40px',
  },
  emptyText: {
    fontSize: '15px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid var(--border)',
    borderTopColor: 'var(--primary)',
    animation: 'spin 0.7s linear infinite',
  },
};
