const { Pool } = require('pg');

export default async function handler(req, res) {
  const { id } = req.query;
  const pool = new Pool({
    user: 'ihascats',
    host: 'db.bit.io',
    database: 'ihascats/job-app', // public database
    password: process.env.BITIO_API, // key from bit.io database page connect menu
    port: 5432,
    ssl: true,
  });

  if (req.method === 'GET') {
    const { rows } = await pool.query(
      `SELECT * FROM job_listing WHERE id = ${id}`,
    );
    res.send({ rows });
  }

  if (req.method === 'DELETE') {
    const { rows } = await pool.query(
      `DELETE FROM job_listing WHERE id = ${id}`,
    );
    res.send({ rows });
  }
}
