const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  const { user } = req.query;
  const directoryPath = `./uploads/${user}/resume`;
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const fileArray = fs.readdirSync(directoryPath, function (err) {
    if (err) throw err;
  });
  const resumes = [];
  fileArray.forEach((file) => {
    const statArray = fs.statSync(
      path.join(directoryPath, file),
      function (err) {
        if (err) throw err;
      },
    );
    resumes.push({ name: file, createdAt: statArray.birthtime });
  });

  res.send({ resumes });
}
