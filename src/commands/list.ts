import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export default async function list(options: { album?: string }) {
  const s3Client = new S3Client({ region: "ru-central1a" });

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: options.album ?? "",
  };

  const data = await s3Client.send(new ListObjectsV2Command(params));

  if (!data.Contents) throw new Error("TODO");

  data.Contents.forEach(file => {
    console.log(file.Key);
  });
}
