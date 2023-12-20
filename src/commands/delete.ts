import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function remove(options: { album: string; photo?: string }) {
  const s3Client = new S3Client({ region: "ru-central1a" });
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: options.photo ? `${options.album}/${options.photo}` : `${options.album}/`,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log("Success");
  } catch (err) {
    console.log("Error", err);
  }
}
