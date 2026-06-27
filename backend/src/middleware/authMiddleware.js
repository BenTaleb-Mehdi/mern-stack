import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(403).json({ error: "Access denied! No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next(); // Green light: Proceed to the controller
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token!" });
  }
};