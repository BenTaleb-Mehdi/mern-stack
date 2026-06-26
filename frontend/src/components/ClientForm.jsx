import { useState, useEffect } from 'react';

export default function ClientForm({ onAddClient, onUpdateClient, editingClient, onCancelEdit }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  // If editingClient changes, fill the form or clear it
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return alert('Please enter the client name and phone number!');
    
    if (editingClient) {
      // If we are in edit mode
      onUpdateClient(editingClient.id, { name, phone, description });
    } else {
      // If we are in add mode
      onAddClient({ name, phone, description });
    }

    // Clear the form after submission
    setName('');
    setPhone('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', padding: '15px', border: editingClient ? '2px solid #007bff' : '1px solid #ccc' }}>
      <h3>{editingClient ? 'Update Client' : 'Add New Client'}</h3>
      <input type="text" placeholder="Client name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ padding: '8px', flex: 1, cursor: 'pointer', backgroundColor: editingClient ? '#007bff' : '#28a745', color: 'white', border: 'none' }}>
          {editingClient ? 'Update Client' : 'Add New Client'}
        </button>
        {editingClient && (
          <button type="button" onClick={onCancelEdit} style={{ padding: '8px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}