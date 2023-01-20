const { Pool } = require('pg');

export default async function handler(req, res) {
  const pool = new Pool({
    user: 'ihascats',
    host: 'db.bit.io',
    database: 'ihascats/job-app', // public database
    password: process.env.BITIO_API, // key from bit.io database page connect menu
    port: 5432,
    ssl: true,
  });
  const { rows } = await pool.query(
    `SELECT "createdAt", "company", "position", "id" FROM job_listing`,
  );
  res.send({ rows });
}
