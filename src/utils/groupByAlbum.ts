export const groupByAlbum = (paths: string[]): Record<string, string[]> => {
  const albums: Record<string, string[]> = {};

  paths.forEach(path => {
    const [album, file] = path.split("/");
    if (!albums[album]) albums[album] = [];
    albums[album].push(file);
  });

  return albums;
};
