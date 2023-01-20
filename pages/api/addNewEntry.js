const { Pool } = require('pg');
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

  const pool = new Pool({
    user: 'ihascats',
    host: 'db.bit.io',
    database: 'ihascats/job-app', // public database
    password: process.env.BITIO_API, // key from bit.io database page connect menu
    port: 5432,
    ssl: true,
  });

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
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
    await pool.query(
      `INSERT INTO "job_listing" ("createdAt", "status", "company", "position", "link", "location", "salary", "notes", "resume", "cover") VALUES ('${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(
          'T',
          ' ',
        )}', '${status}' ,'${company}', '${position}', '${link}', '${location}', '${salary}', '${notes}', '${resume}', '${cover}')`,
    );
  }

  form.parse(req, async (err, fields, files) => {
    const { resume, cover_letter: cover } = files;
    cover ? (fields.cover = cover.originalFilename) : (fields.cover = '');
    resume ? (fields.resume = resume.originalFilename) : null;

    insertData(fields);
    res.send({ status: 'finished', fields, files });
  });
}
