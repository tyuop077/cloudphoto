import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { Glob } from "glob";
import path from "path";
import { readConfig } from "../utils/config.js";

export default async function upload(options: { album?: string; path?: string }) {
  if (!options.album) throw new Error("Album was not provided");
  const directory = options.path ?? process.cwd();

  if (!fs.existsSync(directory)) {
    throw new Error(`Directory does not exist: ${directory}`);
  }

  const config = readConfig();

  const s3Client = new S3Client({ region: "ru-central1a" });
  const imageNames = new Glob(directory + "/*.{png,jpg,jpeg,webm}", {});

  for await (const imageName of imageNames) {
    const fileStream = fs.createReadStream(imageName);

    try {
      const data = await s3Client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: `${options.album}/${path.basename(imageName)}`,
          Body: fileStream,
        })
      );
    } catch (err) {
      console.warn(`Cannot upload ${imageName}: ${(<Error>err).message ?? err}`);
    }
  }
}
