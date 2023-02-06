import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';

export default async function handler(req, res) {
  const { user } = req.query;

  const params = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Delimiter: '/',
    Prefix: `uploads/${user}/resume/`,
  };
  const s3Client = new S3Client({
    region: process.env.S3_UPLOAD_REGION,
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY,
      secretAccessKey: process.env.S3_UPLOAD_SECRET,
    },
  });
  const data = await s3Client.send(new ListObjectsCommand(params));
  const resumes = [];
  data.Contents.forEach((file) => {
    resumes.push({
      name: file.Key.split(params.Prefix)[1],
      createdAt: file.LastModified,
    });
  });

  res.send({ resumes });
}
