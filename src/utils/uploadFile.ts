import { PutObjectCommand } from "@aws-sdk/client-s3";
import BucketClient from "./bucketClient.js";
import { fileTypeFromFile } from "file-type";
import fs from "fs";

export interface UploadFileOptions {
  filePath: string;
  bucket: string;
  key: string;
}

export const uploadFile = async (client: BucketClient, options: UploadFileOptions) => {
  const fileStream = fs.createReadStream(options.filePath);
  const { mime } = (await fileTypeFromFile(options.filePath))!;

  await client.send(
    new PutObjectCommand({
      Bucket: options.bucket,
      Key: options.key,
      Body: fileStream,
      ContentType: `${mime}; charset=utf-8`,
    })
  );
};
