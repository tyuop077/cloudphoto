import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { pipeline } from "node:stream/promises";
import fs from "fs";
import path from "path";

export default async function download(options: { album: string; path?: string }) {
  const directory = options.path ?? process.cwd();
  const s3Client = new S3Client({ region: "ru-central1a" });

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: `${options.album}/`,
  };

  const data = await s3Client.send(new ListObjectsV2Command(params));

  if (!data.Contents) throw new Error("TODO");

  data.Contents.forEach(async file => {
    if (!file.Key) return;

    const getParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: file.Key,
    };
    const response = await s3Client.send(new GetObjectCommand(getParams));

    if (!(response.Body instanceof Readable)) return;

    const fileStream = fs.createWriteStream(directory + "/" + path.basename(file.Key));

    await pipeline(response.Body, fileStream);
  });
}
