require('dotenv').config();
const express   = require('express');
const path      = require('path');
const cors      = require('cors');
const helmet    = require('helmet');
const connectDB = require('./config/db');

// ─── Route imports ───────────────────────────────────────────
const profileRoutes  = require('./routes/profile');
const projectRoutes  = require('./routes/projects');
const skillRoutes    = require('./routes/skills');
const contactRoutes  = require('./routes/contact');

const app = express();

// ─── Database (cached connection for serverless) ─────────────
connectDB();

// ─── Security & Middleware ───────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// CORS — allow all origins (Vercel serves from its own domain)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// Only use morgan in development (not serverless)
if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Static Files (local dev only — Vercel handles via routes) ─
app.use('/public', express.static(path.join(__dirname, '../frontend/public')));

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
);

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/profile',  profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills',   skillRoutes);
app.use('/api/contact',  contactRoutes);   // rate-limit removed (serverless-safe)

// ─── Serve Frontend SPA ──────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// ─── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// ─── Start server ONLY in local dev (NOT on Vercel) ──────────
// Vercel imports this file as a module — app.listen() must NOT run
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

// Must export app for Vercel serverless
module.exports = app;
