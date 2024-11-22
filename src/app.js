import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import noteRoutes from './routes/noteRoutes.js';
import { errorHandler } from './utils/errors.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes);

// Error handling
app.use(errorHandler);

export default app;