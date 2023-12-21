import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { readConfig } from "../utils/config.js";

export default async function list(options: { album?: string }) {
  if (!options.album) throw new Error("Album was not provided");

  const config = readConfig();

  const s3Client = new S3Client({ region: config.region });

  const data = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
      Prefix: options.album ? `${options.album}/` : "",
    })
  );

  if (!data.Contents) throw new Error(`No ${options.album ? "images" : "albums"} found`);

  for (const file of data.Contents) {
    if (!file.Key) return;

    console.log(file.Key);
  }
}
