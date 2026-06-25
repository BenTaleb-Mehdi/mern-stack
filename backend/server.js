import express from 'express';
import cors from 'cors';
import prisma from './db';

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 CREATE: Add a new client
app.post('/api/clients', async (req, res) => {
  const { name, description, phone } = req.body;
  try {
    const newClient = await prisma.client.create({
      data: { name, description, phone }
    });
    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 READ: Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' } // Newest clients first
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 UPDATE: Update client info
app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, phone } = req.body;
  try {
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(id) },
      data: { name, description, phone }
    });
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔴 DELETE: Remove a client
app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.client.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Client removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));