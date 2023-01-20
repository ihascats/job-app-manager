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

  const form = new formidable.IncomingForm();
  form.options.keepExtensions = true;
  const dir = `./uploads/${process.env.USERNAME}`;

  form.parse(req);
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
  res.send({ status: 'finished' });
}
