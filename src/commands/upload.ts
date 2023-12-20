import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { glob } from "glob";
import path from "path";

export default async function upload(options: { album: string; path?: string }) {
  const s3Client = new S3Client({ region: "ru-central1a" });
  const directory = options.path ?? process.cwd();
  const images = glob.sync(directory + "/*.jpg");

  for (const image of images) {
    const fileStream = fs.createReadStream(image);

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${options.album}/${path.basename(image)}`,
      Body: fileStream,
    };

    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      console.log(`Updated ${path.basename(image)}`);
    } catch (err) {
      console.log("Error", err);
    }
  }
}
