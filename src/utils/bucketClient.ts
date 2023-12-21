import { S3Client } from "@aws-sdk/client-s3";
import { Config } from "./config.js";

export default class BucketClient extends S3Client {
  constructor(config: Config) {
    super({
      region: config.region,
      endpoint: config.endpointUrl,
      credentials: {
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
      },
    });
  }
}
