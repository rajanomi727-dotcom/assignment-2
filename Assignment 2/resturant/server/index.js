const express  = require('express');
const cors     = require('cors');
require('dotenv').config();

const pool = require('./db');
const app  = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'NIXH API' }));

// ─── GET /profile ─────────────────────────────────────────────────────────────
// Returns the first (and only) user row. Seed is auto-created if the table is empty.
app.get('/profile', async (_req, res) => {
  try {
    // Ensure table exists
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id    INT          NOT NULL AUTO_INCREMENT,
        name  VARCHAR(120) NOT NULL DEFAULT '',
        email VARCHAR(200) NOT NULL DEFAULT '',
        phone VARCHAR(30)  NOT NULL DEFAULT '',
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [rows] = await pool.execute('SELECT * FROM users LIMIT 1');

    if (rows.length === 0) {
      // Seed default profile
      await pool.execute(
        'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
        ['Alex Rivera', 'alex.rivera@nixh.app', '+1 (555) 000-0001']
      );
      const [seeded] = await pool.execute('SELECT * FROM users LIMIT 1');
      return res.json({ success: true, data: seeded[0] });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('GET /profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /profile ─────────────────────────────────────────────────────────────
app.put('/profile', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  try {
    const [rows] = await pool.execute('SELECT id FROM users LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const userId = rows[0].id;
    await pool.execute(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name ?? '', email ?? '', phone ?? '', userId]
    );

    const [updated] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    res.json({ success: true, data: updated[0] });
  } catch (err) {
    console.error('PUT /profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀  NIXH server running on http://0.0.0.0:${PORT}`);
});
