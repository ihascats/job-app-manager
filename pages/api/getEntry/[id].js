const mysql = require('mysql2');

export default async function handler(req, res) {
  const { id } = req.query;
  const connection = mysql.createConnection(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    connection.query(
      `SELECT * FROM job_listing WHERE id = ${id}`,
      (err, rows) => {
        // ... use the result ...
        res.send({ rows });
      },
    );
  }

  if (req.method === 'DELETE') {
    connection.query(
      `DELETE FROM job_listing WHERE id = ${id}`,
      (err, rows) => {
        // ... use the result ...
        res.send({ rows });
      },
    );
  }
  connection.end();
}
