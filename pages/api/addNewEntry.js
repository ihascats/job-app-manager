const { Pool } = require('pg');
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }
  const pool = new Pool({
    user: 'ihascats',
    host: 'db.bit.io',
    database: 'ihascats/job-app', // public database
    password: process.env.BITIO_API, // key from bit.io database page connect menu
    port: 5432,
    ssl: true,
  });
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields) => {
    console.log(fields);
    const newEntry = await pool.query(
      `INSERT INTO "job_listing" VALUES (3, '${fields.company}', '${fields.position}', '${fields.link}', '${fields.location}', '${fields.salary}', '${fields.notes}')`,
    );
    const { rows } = await pool.query('SELECT COUNT(*) FROM "job_listing"');
    res.send(rows[0]);
  });
}
