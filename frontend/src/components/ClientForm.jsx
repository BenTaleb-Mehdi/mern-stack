import { useState, useEffect } from 'react';
import { clientApi } from '../Api/clientApi';

export default function ClientForm({ onAddClient, onUpdateClient, editingClient, onCancelEdit }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setPhone(editingClient.phone);
      setDescription(editingClient.description || '');
    } else {
      setName('');
      setPhone('');
      setDescription('');
    }
  }, [editingClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitting(true);
    try {
      if (editingClient) {
        await onUpdateClient(editingClient.id, { name, phone, description });
      } else {
        await onAddClient({ name, phone, description });
      }
      setName('');
      setPhone('');
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formHeader}>
        <h3 style={styles.formTitle}>{editingClient ? 'Modifier le Client' : 'Nouveau Client'}</h3>
        {editingClient && (
          <button type="button" onClick={onCancelEdit} style={styles.cancelBtn}>Annuler</button>
        )}
      </div>
      <div style={styles.fields}>
        <div style={styles.field}>
          <label style={styles.label}>Nom</label>
          <input
            type="text"
            placeholder="Nom du client"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Téléphone</label>
          <input
            type="text"
            placeholder="Numéro de téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            placeholder="Description (optionnelle)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.input, resize: 'vertical', minHeight: '80px' }}
          />
        </div>
      </div>
      <button type="submit" disabled={submitting} style={styles.submitBtn}>
        {submitting ? 'En cours...' : editingClient ? 'Mettre à jour' : 'Ajouter le client'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text)',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--card-bg)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text)',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    fontSize: '14px',
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    fontFamily: 'var(--sans)',
  },
  submitBtn: {
    padding: '12px 24px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    alignSelf: 'flex-start',
  },
};
