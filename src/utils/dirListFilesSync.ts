import fs from 'fs-extra';
import path from 'path';

export const dirListFilesSync = (dir: string): string[] => {
  const filesInDirectory = fs.readdirSync(dir);
  let files: string[] = [];

  for (const file of filesInDirectory) {
    const absolute = path.join(dir, file);
    if (fs.statSync(absolute).isDirectory()) {
      files = [...files, ...dirListFilesSync(absolute)];
    } else {
      files.push(absolute);
    }
  }

  return files;
};
