import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { readConfig } from "../utils/config.js";
import BucketClient from "../utils/bucketClient.js";
import { groupByAlbum } from "../utils/groupByAlbum.js";

export default async function mksite() {
  const config = readConfig();

  const bucketClient = new BucketClient(config);

  const dataList = await bucketClient.send(
    new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: "",
    })
  );

  if (!dataList.Contents) throw new Error(`No bucket contents found`);

  const albums = groupByAlbum(dataList.Contents.map(file => <string>file.Key).filter(Boolean));

  const index_html = `<!doctype html>
<html>
    <head>
        <title>Фотоархив</title>
    </head>
<body>
    <h1>Фотоархив</h1>
    <ul>
${Object.keys(albums)
  .map((album, i) => `        <li><a href="album${i + 1}.html">${album}</a></li>`)
  .join("\n")}
    </ul>
</body>`;

  await bucketClient.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: `index.html`,
      Body: index_html,
    })
  );

  /*for (const [album, fileNames] of Object.entries(albums)) {
  }*/
}
