const fs = require('fs');

import formidable from 'formidable';
import path from 'path';

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
  // https://github.com/vercel/next.js/discussions/34295#discussioncomment-2170657
  const dir = path.resolve(process.cwd(), 'uploads', user);

  form.parse(req);
  form.on('file', function (field, file) {
    form.uploadDir = path.resolve(process.cwd(), dir, field);
    const newFilePath = path.resolve(
      process.cwd(),
      form.uploadDir,
      file.originalFilename,
    );
    if (fs.existsSync(newFilePath)) {
      res.status(401).send({ error: 'file with that name already exists' });
      return;
    }
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    fs.rename(file.filepath, newFilePath, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    res.status(200).send({ success: 'file uploaded successfully' });
  });
}
