const mysql = require('mysql2');

export default async function handler(req, res) {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  const { user } = req.query;
  connection.query(
    `SELECT * FROM job_listing WHERE user = '${user}'`,
    (err, rows) => {
      res.send({ rows });
      connection.end();
    },
  );
}
