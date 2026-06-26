import { useState, useEffect } from 'react';
import { clientApi } from '../Api/clientApi';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientApi.getAll();
      setClients(data);
    } catch (err) {
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData) => {
    try {
      const newClient = await clientApi.create(clientData);
      setClients((prev) => [...prev, newClient]);
    } catch (err) {
      alert('Error adding client');
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      const updated = await clientApi.update(id, clientData);
      // Replacing the old client with the new one in the State
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      alert('Error updating client');
    }
  };

  const deleteClient = async (id) => {
    try {
      await clientApi.delete(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Error deleting client');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, error, addClient, deleteClient, updateClient };
}