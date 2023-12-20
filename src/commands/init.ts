import fs from "fs";
import path from "path";
import inquirer, { QuestionCollection } from "inquirer";
import os from "os";
import ini from "ini";

export default async function init() {
  const questions: QuestionCollection = [
    { name: "aws_access_key_id", type: "input", message: "Access key ID:" },
    { name: "aws_secret_access_key", type: "input", message: "Secret access key:" },
    { name: "bucket", type: "input", message: "Bucket name:", default: "bucket" },
  ];

  const answers = await inquirer.prompt(questions);

  const configuration = {
    DEFAULT: {
      ...answers,
      region: "ru-central1",
      endpoint_url: "https://storage.yandexcloud.net",
    },
  };

  const configPath = path.join(os.homedir(), ".config", "cloudphoto");

  fs.mkdirSync(configPath, { recursive: true });

  fs.writeFileSync(path.join(configPath, "cloudphotorc"), ini.stringify(configuration));

  console.log("Configuration file saved successfully.");
}
