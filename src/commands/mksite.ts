import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { readConfig } from "../utils/config.js";
import BucketClient from "../utils/bucketClient.js";
import { groupByAlbum } from "../utils/groupByAlbum.js";
import { uploadHTML } from "../utils/uploadHTML.js";
import { onlyFolders } from "../utils/onlyFolders.js";

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

  const albums = groupByAlbum(onlyFolders(dataList.Contents.map(file => <string>file.Key).filter(Boolean)));

  console.log(dataList.Contents.map(file => <string>file.Key).filter(Boolean));
  console.log(albums);

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

  await uploadHTML({
    bucket: config.bucket,
    filename: `index.html`,
    content: index_html,
    client: bucketClient,
  });

  let i = 1;

  for (const [album, fileNames] of Object.entries(albums)) {
    const album_html = `<!doctype html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/themes/classic/galleria.classic.min.css" />
        <style>
            .galleria{ width: 960px; height: 540px; background: #000 }
        </style>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/galleria.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/themes/classic/galleria.classic.min.js"></script>
    </head>
    <body>
        <div class="galleria">
${fileNames.map(fileName => `            <img src="${album}/${fileName}" data-title="${fileName}">`).join("\n")}
        </div>
        <p>Вернуться на <a href="index.html">главную страницу</a> фотоархива</p>
        <script>
            (function() {
                Galleria.run('.galleria');
            }());
        </script>
    </body>
</html>`;

    await uploadHTML({
      bucket: config.bucket,
      filename: `album${i++}.html`,
      content: album_html,
      client: bucketClient,
    });
  }
}
