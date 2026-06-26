import express from 'express';
import Client from '../models/client.js';
import ClientService from '../services/clientService.js';
import ClientController from '../controllers/clientController.js';

const router = express.Router();

const client = new Client();
const clientService = new ClientService(client);
const clientController = new ClientController(clientService);

router.post('/', clientController.create);
router.get('/', clientController.getAll);
router.get('/:id', clientController.getById);
router.put('/:id', clientController.update);
router.delete('/:id', clientController.delete);

export default router;