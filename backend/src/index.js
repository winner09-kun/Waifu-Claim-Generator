import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import certificateRoutes from './routes/certificate.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
app.use('/api', certificateRoutes);

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Global Error Handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🎌 Waifu Cert API running on http://localhost:${PORT}`);
});
