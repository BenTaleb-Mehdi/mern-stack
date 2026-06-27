import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { randomUUID } = await import('node:crypto');
    const now = new Date();

    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: name || email.split('@')[0],
        email,
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: user.id,
        providerId: 'credential',
        userId: user.id,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
    });

    res.status(201).json({ message: 'Account created successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password!' });

    const account = await prisma.account.findFirst({
      where: { userId: user.id, providerId: 'credential' },
    });

    if (!account || !account.password) {
      return res.status(401).json({ error: 'Invalid email or password!' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password!' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
