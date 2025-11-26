// index.js - Entrypoint (Postgres-backed)
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { init } = require('./db');
const authRoutes = require('./routes/auth');
const streamsRoutes = require('./routes/streams');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  try {
    // initialize DB (create tables if needed)
    await init();
  } catch (err) {
    console.error('Failed to initialize DB:', err);
    process.exit(1);
  }

  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.use(morgan('dev'));

  app.use('/auth', authRoutes);
  app.use('/streams', streamsRoutes);

  app.get('/', (req, res) => res.send('Streamer API (Postgres) running'));
  app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error', err);
    res.status(500).json({ error: 'internal_error' });
  });

  const server = app.listen(PORT, () => {
    console.log(`Streamer API listening on port ${PORT}`);
  });

  // Graceful shutdown
  function shutdown() {
    console.log('Shutting down...');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forcing shutdown');
      process.exit(1);
    }, 5000).unref();
  }
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start();