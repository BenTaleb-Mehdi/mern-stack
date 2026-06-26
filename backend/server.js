import express from 'express';
import cors from 'cors';
import clientRoutes from './src/routes/clientRoutes.js'; 

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/clients', clientRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running firmly on port ${PORT}`));