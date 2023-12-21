import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { readConfig } from "../utils/config.js";
import BucketClient from "../utils/bucketClient.js";

export default async function remove(options: { album?: string; photo?: string }) {
  if (!options.album) throw new Error("Album was not provided");

  const config = readConfig();

  const bucketClient = new BucketClient(config);

  try {
    await bucketClient.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: options.photo ? `${options.album}/${options.photo}` : `${options.album}/`,
      })
    );
    console.log("Success");
  } catch (err) {
    if (options.photo) {
      throw new Error("Image was not found");
    } else {
      await bucketClient.send(
        new DeleteObjectCommand({
          Bucket: config.bucket,
          Key: `${options.album}`,
        })
      );
    }
  }
}
