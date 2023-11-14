import { S3Client} from "@aws-sdk/client-s3"
import dotenv from 'dotenv';

dotenv.config();

const bucketName: string | undefined = process.env.AWS_BUCKET_NAME;
const region: string | undefined = process.env.AWS_BUCKET_REGION;
const accessKeyId: string | undefined = process.env.AWS_ACCESS_KEY;
const secretAccessKey: string | undefined = process.env.AWS_SECRET_ACCESS_KEY;

if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
  throw new Error("AWS configuration is incomplete.");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export {
    bucketName, region, accessKeyId, secretAccessKey, s3Client
}
