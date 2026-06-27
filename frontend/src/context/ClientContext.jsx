import { createContext, useContext } from 'react';
import { useClients } from '../hooks/useClients';

const ClientContext = createContext(null);

export function ClientProvider({ children }) {
  const clientData = useClients();
  return (
    <ClientContext.Provider value={clientData}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClientContext must be used within ClientProvider');
  return ctx;
}
