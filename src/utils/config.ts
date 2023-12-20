import fs from "fs";
import ini from "ini";
import path from "path";
import os from "os";

interface Config {
  bucket: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  region: string;
  endpointUrl: string;
}

const expectedKeys = ["bucket", "aws_access_key_id", "aws_secret_access_key", "region", "endpoint_url"];

export function readConfig(): Config {
  const configPath = path.join(os.homedir(), ".config", "cloudphoto", "cloudphotorc");

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at ${configPath}`);
  }

  const configObj = ini.parse(fs.readFileSync(configPath, "utf-8"));
  const config = configObj["DEFAULT"];

  expectedKeys.forEach(key => {
    if (!(key in config)) {
      throw new Error(`Expected key ${key} not found in configuration file`);
    }
  });

  return {
    bucket: config.bucket,
    awsAccessKeyId: config.aws_access_key_id,
    awsSecretAccessKey: config.aws_secret_access_key,
    region: config.region,
    endpointUrl: config.endpoint_url,
  };
}
