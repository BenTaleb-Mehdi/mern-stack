class ClientController {
  constructor(clientService) {
    this.clientService = clientService;
  }

  create = async (req, res) => {
    try {
      const client = await this.clientService.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getAll = async (req, res) => {
    try {
      const clients = await this.clientService.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const client = await this.clientService.getClientById(req.params.id);
      res.status(200).json(client);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const client = await this.clientService.updateClient(req.params.id, req.body);
      res.status(200).json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      await this.clientService.deleteClient(req.params.id);
      res.status(200).json({ message: "تم حذف العميل بنجاح" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

export default ClientController;