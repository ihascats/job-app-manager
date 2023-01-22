const mysql = require('mysql2');

export default async function handler(req, res) {
  const connection = mysql.createConnection(process.env.DATABASE_URL);
  connection.query(
    `SELECT createdAt, company, position, id FROM job_listing`,
    (err, rows) => {
      res.send({ rows });
      connection.end();
    },
  );
}
