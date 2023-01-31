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
  const { user } = req.query;

  const connection = mysql.createConnection(process.env.DATABASE_URL);

  const form = new formidable.IncomingForm();
  form.options.keepExtensions = true;
  const dir = `./uploads/${user}`;

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

  // https://stackoverflow.com/a/17415677/19683372
  function toIsoString(date) {
    var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num) {
        return (num < 10 ? '0' : '') + num;
      };

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds()) +
      dif +
      pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' +
      pad(Math.abs(tzo) % 60)
    );
  }

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
    const createdAt = `${toIsoString(new Date())
      .slice(0, 19)
      .replace('T', ' ')}`;
    connection.query(
      `INSERT INTO job_listing (createdAt, status, company, position, link, location, salary, notes, resume, cover, user) VALUES ('${createdAt}', '${status}' ,'${company}', '${position}', '${link}', '${location}', '${salary}', '${notes}', '${resume}', '${cover}', '${user}')`,
      (err, rows) => {
        console.log(rows);
        res.send({ insertedId: rows.insertId, createdAt });
        connection.end();
      },
    );
  }

  form.parse(req, async (err, fields, files) => {
    const { resume, cover } = files;
    cover ? (fields.cover = cover.originalFilename) : (fields.cover = '');
    resume ? (fields.resume = resume.originalFilename) : null;

    insertData(fields);
  });
}
