import { PutObjectCommand } from "@aws-sdk/client-s3";
import BucketClient from "./bucketClient.js";

interface Options {
  content: string;
  bucket: string;
  filename: string;
  client: BucketClient;
}

export const uploadHTML = async (options: Options) => {
  const buffer = Buffer.from(await new Blob([options.content], { type: "text/html" }).arrayBuffer());

  await options.client.send(
    new PutObjectCommand({
      Bucket: options.bucket,
      Key: options.filename,
      Body: buffer,
      ContentType: "text/html; charset=utf-8",
    })
  );
};
