class ClientService {
  constructor(clients) {
    this.clients = clients;
  }

  async createClient(data) {
    if (!data.name || !data.phone) {
      throw new Error("Invalid data: name and phone are required");
    }
    return await this.clients.create(data);
  }

  async getAllClients() {
    return await this.clients.getAll();
  }

  async getClientById(id) {
    const client = await this.clients.getById(id);
    if (!client) throw new Error("Client not found");
    return client;
  }

  async updateClient(id, data) {
    await this.getClientById(id);
    return await this.clients.update(id, data);
  }

  async deleteClient(id) {
    await this.getClientById(id);
    return await this.clients.delete(id);
  }
}

export default ClientService;