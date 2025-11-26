// routes/streams.js (Postgres-backed)
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper to map DB row to API safe object
function rowToStream(r) {
  return {
    id: r.id,
    title: r.title,
    summary: r.summary,
    url: r.url,
    tags: r.tags || [],
    ownerId: r.owner_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// Create stream
router.post('/', authMiddleware, async (req, res) => {
  const { title, summary, url, tags } = req.body || {};
  if (!title || !url) return res.status(400).json({ error: 'title and url are required' });
  const id = uuidv4();
  const tagsArr = Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []);
  try {
    const q = `INSERT INTO streams (id, title, summary, url, tags, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const { rows } = await pool.query(q, [id, title, summary || null, url, tagsArr, req.user.id]);
    res.status(201).json(rowToStream(rows[0]));
  } catch (err) {
    console.error('create stream error', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Update stream (owner only)
router.put('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const { rows: existingRows } = await pool.query('SELECT owner_id FROM streams WHERE id = $1', [id]);
    if (existingRows.length === 0) return res.status(404).json({ error: 'not_found' });
    if (existingRows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'forbidden' });

    const { title, summary, url, tags } = req.body || {};
    const updates = [];
    const params = [];
    let idx = 1;
    if (title !== undefined) { updates.push(`title = $${idx++}`); params.push(title); }
    if (summary !== undefined) { updates.push(`summary = $${idx++}`); params.push(summary); }
    if (url !== undefined) { updates.push(`url = $${idx++}`); params.push(url); }
    if (tags !== undefined) {
      const tagsArr = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
      updates.push(`tags = $${idx++}`); params.push(tagsArr);
    }
    updates.push(`updated_at = now()`);

    const sql = `UPDATE streams SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`;
    params.push(id);

    const { rows } = await pool.query(sql, params);
    res.json(rowToStream(rows[0]));
  } catch (err) {
    console.error('update stream error', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Delete stream (owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const { rows: existingRows } = await pool.query('SELECT owner_id FROM streams WHERE id = $1', [id]);
    if (existingRows.length === 0) return res.status(404).json({ error: 'not_found' });
    if (existingRows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'forbidden' });

    await pool.query('DELETE FROM streams WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('delete stream error', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM streams WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'not_found' });
    res.json(rowToStream(rows[0]));
  } catch (err) {
    console.error('get stream error', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// List / search streams
// Query params:
//  q=free text (search in title, summary, tags — any term matches)
//  title=contains, summary=contains, tag (comma or repeated) - requires tags include all provided
//  page, limit
router.get('/', async (req, res) => {
  try {
    const { q, title, summary, tag, page = 1, limit = 20 } = req.query || {};
    const where = [];
    const params = [];
    let idx = 1;

    if (q) {
      // split terms and require any term match (OR across fields, AND between terms is optional - we'll match any term)
      const terms = String(q).split(/\s+/).filter(Boolean);
      const termClauses = terms.map((t) => {
        params.push(`%${t}%`);
        const pidx = idx++;
        return `(title ILIKE $${pidx} OR summary ILIKE $${pidx} OR array_to_string(tags, ' ') ILIKE $${pidx})`;
      });
      where.push(`(${termClauses.join(' OR ')})`);
    }

    if (title) {
      params.push(`%${title}%`); where.push(`title ILIKE $${idx++}`);
    }
    if (summary) {
      params.push(`%${summary}%`); where.push(`summary ILIKE $${idx++}`);
    }
    if (tag) {
      // tag may be comma-separated or multiple params; normalize to array
      const tags = Array.isArray(tag) ? tag : String(tag).split(',').map(t => t.trim()).filter(Boolean);
      if (tags.length > 0) {
        params.push(tags); where.push(`tags @> $${idx++}::text[]`);
      }
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    // Total count
    const countSql = `SELECT COUNT(*) FROM streams ${whereSql}`;
    const countRes = await pool.query(countSql, params);
    const total = parseInt(countRes.rows[0].count, 10);

    // Pagination
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (p - 1) * l;

    // Final query
    const dataSql = `SELECT * FROM streams ${whereSql} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    const dataParams = params.concat([l, offset]);
    const dataRes = await pool.query(dataSql, dataParams);
    const items = dataRes.rows.map(rowToStream);

    res.json({ total, page: p, limit: l, items });
  } catch (err) {
    console.error('list streams error', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

module.exports = router;