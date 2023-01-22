const mysql = require('mysql2');
const fs = require('fs');

import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;
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
    const dir = `./uploads/${process.env.USERNAME}`;

    form.on('file', function (field, file) {
      form.uploadDir = dir + '/' + field;
      const newFilePath = form.uploadDir + '/' + file.originalFilename;

      if (!fs.existsSync(dir + '/' + field)) {
        fs.mkdirSync(dir + '/' + field, { recursive: true });
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
        `UPDATE job_listing SET status = '${status}', company = '${company}', position = '${position}', link = '${link}', location = '${location}', salary = '${salary}', notes = '${notes}', resume = '${resume}', cover = '${cover}' WHERE id = ${id}`,
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
