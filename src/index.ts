import AgentAPI from 'apminsight';
AgentAPI.config();

import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import { auth } from './lib/auth.js';
import securityMiddleware from './middleware/security.js';
import subjectsRouter from './routes/subjects.js';

const app = express();
const PORT = 8000;

// setup cors
if (!process.env.FRONTEND_URL)
  throw new Error('FRONTEND_URL is not set in .env file');

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
app.use(securityMiddleware);
app.use('/api/subjects', subjectsRouter);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
