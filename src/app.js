import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import noteRoutes from './routes/noteRoutes.js';
import { errorHandler } from './utils/errors.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the "src/ui" directory which is our frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'src/ui')));

app.use('/api/notes', noteRoutes);

app.use(errorHandler);

export default app;