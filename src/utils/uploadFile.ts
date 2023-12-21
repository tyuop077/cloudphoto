import { PutObjectCommand } from "@aws-sdk/client-s3";
import BucketClient from "./bucketClient.js";
import { ReadStream } from "fs";
import { fileTypeFromFile } from "file-type";
import fs from "fs";

interface Options {
  filePath: string;
  bucket: string;
  key: string;
  client: BucketClient;
}

export const uploadFile = async (options: Options) => {
  const fileStream = fs.createReadStream(options.filePath);
  const { mime } = (await fileTypeFromFile(options.filePath))!;

  await options.client.send(
    new PutObjectCommand({
      Bucket: options.bucket,
      Key: options.key,
      Body: fileStream,
      ContentType: `${mime}; charset=utf-8`,
    })
  );
};
