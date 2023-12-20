import { program } from "commander";
import * as commands from "./commands.js";

program.version("1.0", "-v, --version").description("CloudPhoto").nameFromFilename("cloudphoto");

program.command("init").description("initialize the CloudPhoto").action(commands.init);

program
  .command("upload")
  .description("upload photos to an album")
  .option("-p, --photos [photos]", "photos directory")
  .option("-a, --album [album]", "album name")
  .action(commands.upload);

program
  .command("download")
  .description("download photos from an album")
  .option("-p, --photos [photos]", "photos directory")
  .option("-a, --album [album]", "album name")
  .action(commands.download);

program
  .command("list")
  .description("list photos in an album")
  .option("-a, --album [album]", "album name")
  .action(commands.list);

program
  .command("delete")
  .description("delete an album or a photo")
  .option("-a, --album [album]", "album name")
  .option("-p, --photo [photo]", "photo name")
  .action(commands.delete);

program.parse(process.argv);
