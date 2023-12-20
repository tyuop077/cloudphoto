import inquirer, { QuestionCollection } from "inquirer";
import fs from "fs";

export default function init() {
  const questions: QuestionCollection = [
    { name: "AWS_ACCESS_KEY_ID", message: "AWS Access Key ID" },
    { name: "AWS_SECRET_ACCESS_KEY", message: "AWS Secret Access Key" },
    { name: "BUCKET_NAME", message: "Bucket Name", default: "bucket" },
  ];
  inquirer.prompt(questions).then(answers => {
    fs.writeFileSync(
      process.env.HOME + "/.config/cloudphoto/cloudphotorc",
      `[DEFAULT]
aws_access_key_id = ${answers.AWS_ACCESS_KEY_ID}
aws_secret_access_key = ${answers.AWS_SECRET_ACCESS_KEY}
bucket = ${answers.BUCKET_NAME}
region = ru-central1a
endpoint_url = https://storage.yandexcloud.net`
    );
  });
}
