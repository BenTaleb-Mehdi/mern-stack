import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

// 🟢 REGISTER: Create a new admin account
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email is already registered!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: { email, password: hashedPassword }
    });
    res.status(201).json({ message: "Admin account created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔵 LOGIN: Verify admin and generate JWT
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: "Invalid email or password!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password!" });

    // Generate token valid for 24 hours
    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ message: "Login successful!", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};