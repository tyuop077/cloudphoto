import fs from "fs";

export const getDirectory = (path?: string) => {
  const directory = path ?? process.cwd();

  if (!fs.existsSync(directory)) {
    throw new Error(`Directory does not exist: ${directory}`);
  }

  return directory;
};
