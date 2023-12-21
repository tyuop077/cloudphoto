import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { readConfig } from "../utils/config.js";
import BucketClient from "../utils/bucketClient.js";

export default async function list(options: { album?: string }) {
  const config = readConfig();

  const bucketClient = new BucketClient(config);

  const data = await bucketClient.send(
    new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: options.album ? `${options.album}/` : "",
    })
  );

  if (!data.Contents) throw new Error(`No ${options.album ? "images" : "albums"} found`);

  // "album/file.png"
  const items = data.Contents.map(file => <string>file.Key).filter(Boolean);

  // если альбом, то берём вторую часть (file.png), иначе первую (album)
  // Set - чтобы возвращать только уникальные значения (для альбомов)
  const values = new Set(items.map(file => file.split("/")[options.album ? 1 : 0]));
  console.log(Array.from(values).join("\n"));
}
