import express from 'express';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'dernier_metro',
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'app',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

const app = express();
app.use(express.json());

// --- déjà présent ---
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (e) {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

app.get('/next-metro', async (req, res) => {
  const { station } = req.query;
  if (!station) return res.status(400).json({ error: 'missing station' });
  const now = new Date();
  const nextArrival = new Date(now.getTime() + 3 * 60 * 1000);
  res.json({ station, requestedAt: now.toISOString(), nextArrival: nextArrival.toISOString() });
});

// --- AJOUT J2: CRUD STATIONS ---

// LISTE toutes les stations
app.get('/stations', async (_req, res) => {
  try {
    const r = await pool.query('SELECT * FROM stations ORDER BY id');
    res.json(r.rows);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// LIRE une station par id
app.get('/stations/:id', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM stations WHERE id=$1', [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// CRÉER une station
app.post('/stations', async (req, res) => {
  const { name, line } = req.body || {};
  if (!name || !line) return res.status(400).json({ error: 'name and line required' });
  try {
    const r = await pool.query(
      'INSERT INTO stations (name, line) VALUES ($1,$2) RETURNING *',
      [name, line]
    );
    res.status(201).json(r.rows[0]);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// METTRE À JOUR une station
app.put('/stations/:id', async (req, res) => {
  const { name, line } = req.body || {};
  if (!name || !line) return res.status(400).json({ error: 'name and line required' });
  try {
    const r = await pool.query(
      'UPDATE stations SET name=$1, line=$2 WHERE id=$3 RETURNING *',
      [name, line, req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// SUPPRIMER une station
app.delete('/stations/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM stations WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'not found' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- fin CRUD ---

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on :${port}`));
