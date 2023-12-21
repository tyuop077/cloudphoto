import path from "path";

// только файлы, которые находятся в папках (для исключения корневых файлов, например index.html)
export const onlyFolders = (files: string[]) => files.filter(el => path.extname(el.split("/")[0]) === "");
