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

  const form = new formidable.IncomingForm();
  form.options.keepExtensions = true;
  const dir = `./uploads/${user}`;

  form.parse(req);
  form.on('file', function (field, file) {
    form.uploadDir = dir + '/' + field;
    const newFilePath = form.uploadDir + '/' + file.originalFilename;
    if (fs.existsSync(newFilePath)) {
      res.status(401).send({ error: 'file with that name already exists' });
      return;
    }
    if (!fs.existsSync(dir + '/' + field)) {
      fs.mkdirSync(dir + '/' + field, { recursive: true });
    }

    fs.rename(file.filepath, newFilePath, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    res.status(200).send({ success: 'file uploaded successfully' });
  });
}
