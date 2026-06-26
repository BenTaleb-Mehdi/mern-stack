import { useState } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientListe';
import { useClients } from './hooks/useClients';

export default function App() {
  const { clients, loading, error, addClient, updateClient, deleteClient } = useClients();
  const [editingClient, setEditingClient] = useState(null);

  const handleUpdate = async (id, updatedData) => {
    await updateClient(id, updatedData);
    setEditingClient(null); 
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Client Management System (SOLID Architecture)</h1>
      
      <ClientForm 
        onAddClient={addClient} 
        onUpdateClient={handleUpdate}
        editingClient={editingClient}
        onCancelEdit={() => setEditingClient(null)}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && (
        <ClientList 
          clients={clients} 
          onDelete={deleteClient} 
          onEdit={(client) => setEditingClient(client)} 
        />
      )}
    </div>
  );
}