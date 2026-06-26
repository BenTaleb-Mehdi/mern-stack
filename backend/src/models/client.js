import prisma from '../config/prismaClient.js';

class Clients {
  async create(data) {
    return await prisma.client.create({ data });
  }

  async getAll() {
    return await prisma.client.findMany();
  }

  async getById(id) {
    return await prisma.client.findUnique({ where: { id: Number(id) } });
  }

  async update(id, data) {
    return await prisma.client.update({ where: { id: Number(id) }, data });
  }

  async delete(id) {
    return await prisma.client.delete({ where: { id: Number(id) } });
  }
}

export default Clients;