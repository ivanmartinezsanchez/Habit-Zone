import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { habits_db } from './config/conectionDB';
import authRoutes from './routes/authRoutes';
import habitRoutes from './routes/habitRoutes';
import trackerRoutes from './routes/trackerRoutes'; // 👈 asegúrate de importar las rutas, no el controlador

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/tracker', trackerRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});




