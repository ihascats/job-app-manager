const mysql = require('mysql2');
const fs = require('fs');

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

  const connection = mysql.createConnection(process.env.DATABASE_URL);

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

  async function insertData({
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
      `INSERT INTO job_listing (createdAt, status, company, position, link, location, salary, notes, resume, cover) VALUES ('${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(
          'T',
          ' ',
        )}', '${status}' ,'${company}', '${position}', '${link}', '${location}', '${salary}', '${notes}', '${resume}', '${cover}')`,
      (err, rows) => {
        console.log(rows);
        res.send({ insertedId: rows.insertId });
        connection.end();
      },
    );
  }

  form.parse(req, async (err, fields, files) => {
    const { resume, cover_letter: cover } = files;
    cover ? (fields.cover = cover.originalFilename) : (fields.cover = '');
    resume ? (fields.resume = resume.originalFilename) : null;

    insertData(fields);
  });
}
