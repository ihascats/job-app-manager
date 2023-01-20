const fs = require('fs');

export default async function handler(req, res) {
  const resumes = fs.readdirSync(
    `./uploads/${process.env.USERNAME}/resume`,
    function (err) {
      if (err) console.log('ERROR: ' + err);
    },
  );
  res.send({ resumes });
}
