import { useLocation, useNavigate } from 'react-router-dom';
import { useClientContext } from '../context/ClientContext';
import ClientForm from '../components/ClientForm';

export default function FormPage() {
  const { addClient, updateClient } = useClientContext();
  const location = useLocation();
  const navigate = useNavigate();
  const editingClient = location.state?.editingClient || null;

  const handleUpdate = async (id, data) => {
    await updateClient(id, data);
    navigate('/table');
  };

  const handleCancel = () => {
    navigate('/table');
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestion des Clients</h2>
        <p style={styles.subtitle}>Ajouter ou modifier un client</p>
      </div>
      <div style={styles.card}>
        <ClientForm
          onAddClient={addClient}
          onUpdateClient={handleUpdate}
          editingClient={editingClient}
          onCancelEdit={handleCancel}
          key={editingClient?.id || 'new'}
        />
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
    maxWidth: '600px',
  },
};
