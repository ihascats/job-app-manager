const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  const { user, name } = req.query;
  // https://github.com/vercel/next.js/discussions/34295#discussioncomment-2170657
  const directoryPath = path.resolve(process.cwd(), 'uploads', user, 'resume');
  const filePath = path.resolve(process.cwd(), directoryPath, name);

  if (req.method === 'GET') {
    const buffer = fs.readFileSync(filePath);
    res.send(buffer);
  }

  if (req.method === 'DELETE') {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log('path/file.txt was deleted');
      res.send({ status: 'success' });
    });
  }
}
