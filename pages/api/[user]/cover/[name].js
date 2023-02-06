import {
  DeleteObjectCommand,
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { user, name } = req.query;
  const s3Client = new S3Client({
    region: process.env.S3_UPLOAD_REGION,
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY,
      secretAccessKey: process.env.S3_UPLOAD_SECRET,
    },
  });

  if (req.method === 'GET') {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: `uploads/${user}/cover/${name}`,
    });

    const response = await s3Client.send(getCommand);
    res.send(response.Body);
  }

  if (req.method === 'DELETE') {
    const params = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: `uploads/${user}/cover/${name}`,
    };
    await s3Client.send(new DeleteObjectCommand(params));
    res.send({ status: 'success' });
  }

  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.options.keepExtensions = true;
    form.parse(req);
    form.on('file', async function (field, file) {
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.S3_UPLOAD_BUCKET,
        Key: `uploads/${user}/cover/${name}`,
        Body: createReadStream(file.filepath),
      });

      await s3Client.send(uploadCommand);
      res.send({ status: 'success' });
    });
  }
}
