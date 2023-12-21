import { glob } from "glob";
import path from "path";
import { readConfig } from "../utils/config.js";
import { getDirectory } from "../utils/directory.js";
import BucketClient from "../utils/bucketClient.js";
import { uploadFile } from "../utils/uploadFile.js";

export default async function upload(options: { album?: string; path?: string }) {
  if (!options.album) throw new Error("Album was not provided");

  const directory = getDirectory(options.path);
  const config = readConfig();

  const bucketClient = new BucketClient(config);
  const imageNames = await glob("*.{png,jpg,jpeg,webm}", {
    cwd: directory,
  });

  if (imageNames.length === 0) throw new Error(`No images was found in ${directory}`);

  for (const imageName of imageNames) {
    try {
      await bucketClient.uploadFile({
        bucket: config.bucket,
        filePath: path.resolve(directory, imageName),
        key: `${options.album}/${path.basename(imageName)}`,
      });
    } catch (err) {
      console.warn(`Cannot upload ${imageName}: ${(<Error>err).message ?? err}`);
    }
  }
}
