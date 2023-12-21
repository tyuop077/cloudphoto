import { PutObjectCommand } from "@aws-sdk/client-s3";
import BucketClient from "./bucketClient.js";

export interface UploadHTMLOptions {
  content: string;
  bucket: string;
  filename: string;
}

export const uploadHTML = async (client: BucketClient, options: UploadHTMLOptions) => {
  const buffer = Buffer.from(await new Blob([options.content], { type: "text/html" }).arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: options.bucket,
      Key: options.filename,
      Body: buffer,
      ContentType: "text/html; charset=utf-8",
    })
  );
};
