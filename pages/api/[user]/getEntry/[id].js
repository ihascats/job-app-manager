const mysql = require('mysql2');
const fs = require('fs');

import formidable from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { user, id } = req.query;
  const connection = mysql.createConnection(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    connection.query(
      `SELECT * FROM job_listing WHERE id = ${id}`,
      (err, rows) => {
        // ... use the result ...
        res.send({ rows });
        connection.end();
      },
    );
  }

  if (req.method === 'DELETE') {
    connection.query(
      `DELETE FROM job_listing WHERE id = ${id}`,
      (err, rows) => {
        // ... use the result ...
        res.send({ rows });
        connection.end();
      },
    );
  }

  if (req.method === 'PUT') {
    const form = new formidable.IncomingForm();
    form.options.keepExtensions = true;
    // https://github.com/vercel/next.js/discussions/34295#discussioncomment-2170657
    const dir = path.resolve(process.cwd(), 'uploads', user);

    form.on('file', function (field, file) {
      form.uploadDir = path.resolve(process.cwd(), dir, field);
      const newFilePath = path.resolve(
        process.cwd(),
        form.uploadDir,
        file.originalFilename,
      );

      if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir, { recursive: true });
      }

      fs.rename(file.filepath, newFilePath, function (err) {
        if (err) console.log('ERROR: ' + err);
      });
    });

    async function updateData({
      status,
      company,
      position,
      link,
      location,
      salary,
      notes,
      resume,
      cover,
    }) {
      connection.query(
        `UPDATE job_listing SET status = '${status.trim()}', company = '${company.trim()}', position = '${position.trim()}', link = '${link.trim()}', location = '${location.trim()}', salary = '${salary.trim()}', notes = '${notes.trim()}', resume = '${resume.trim()}', cover = '${cover.trim()}' WHERE id = ${id}`,
        (err, rows) => {
          // ... use the result ...
          res.send({ rows });
          connection.end();
        },
      );
    }
    form.parse(req, async (err, fields, files) => {
      const { resume, cover } = files;
      cover ? (fields.cover = cover.originalFilename) : (fields.cover = '');
      resume ? (fields.resume = resume.originalFilename) : null;

      updateData(fields);
    });
  }
}
