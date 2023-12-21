import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { pipeline } from "node:stream/promises";
import fs from "fs";
import path from "path";
import { getDirectory } from "../utils/directory.js";
import { readConfig } from "../utils/config.js";
import BucketClient from "../utils/bucketClient.js";

export default async function download(options: { album?: string; path?: string }) {
  if (!options.album) throw new Error("Album was not provided");

  const directory = getDirectory(options.path);
  const config = readConfig();

  const bucketClient = new BucketClient(config);

  const data = await bucketClient.send(
    new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: `${options.album}/`,
    })
  );

  if (!data.Contents) throw new Error("No images found or album doesn't exist");

  for (const file of data.Contents) {
    if (!file.Key) return;

    const response = await bucketClient.send(
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: file.Key,
      })
    );

    if (!(response.Body instanceof Readable)) return;

    const fileStream = fs.createWriteStream(directory + "/" + path.basename(file.Key));

    try {
      await pipeline(response.Body, fileStream);
    } catch (err) {
      throw new Error(`Cannot write ${file.Key} into directory: ${(<Error>err).message ?? err}`);
    }
  }
}
