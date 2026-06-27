import express from 'express';
import cors from 'cors';
import clientRoutes from './src/routes/clientRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running firmly on port ${PORT}`));