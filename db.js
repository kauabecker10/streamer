// db.js
// PostgreSQL connection and schema initialization
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || null;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and set DATABASE_URL.');
}

// For hosting providers like Render, require SSL but allow self-signed (rejectUnauthorized false)
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  // optional: increase idle timeout or max clients if needed
});

// Initialize tables if they do not exist
async function init() {
  // Use a single client for transactional creation
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Enable uuid-ossp extension if you want DB-side uuid generation (optional)
    // await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // streams table - tags is text[]
    await client.query(`
      CREATE TABLE IF NOT EXISTS streams (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT,
        url TEXT NOT NULL,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ
      );
    `);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database schema:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  init,
};