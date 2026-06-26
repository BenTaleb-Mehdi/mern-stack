export default function ClientList({ clients, onDelete, onEdit }) {
  if (clients.length === 0) return <p>No clients registered currently</p>;

  return (
    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id}>
            <td>{client.name}</td>
            <td>{client.phone}</td>
            <td>{client.description || '-'}</td>
            <td>
              <button onClick={() => onEdit(client)} style={{ color: 'blue', marginRight: '10px', cursor: 'pointer' }}>
                Update
              </button>
              <button onClick={() => onDelete(client.id)} style={{ color: 'red', cursor: 'pointer' }}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}