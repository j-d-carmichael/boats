import fs from 'fs-extra';
import upath from 'upath';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const walker = require('walker');

const toNjk = (file: string) => {
  // ensure we don't double up the njk exts
  if (file.substring(file.length - 4) === '.njk') {
    return;
  }
  const newTarget = file + '.njk';
  fs.moveSync(file, newTarget);
  // read file to string and replace .yml with .yml.njk
  let string = fs.readFileSync(newTarget, { encoding: 'utf8' }).toString();
  const pattern = '.yml';
  const regex = new RegExp(pattern, 'g');
  string = string.replace(regex, '.yml.njk');
  fs.writeFileSync(newTarget, string, { encoding: 'utf8' });
};

const toYml = (file: string) => {
  const newTarget = file.replace('.njk', '');
  fs.moveSync(file, newTarget);
  // read file to string and replace .yml with .yml.njk
  let string = fs.readFileSync(newTarget, { encoding: 'utf8' }).toString();
  const pattern = '.yml.njk';
  const regex = new RegExp(pattern, 'g');
  string = string.replace(regex, '.yml');
  fs.writeFileSync(newTarget, string, { encoding: 'utf8' });
};

export default (dir: string, type: 'yml' | 'njk'): void => {
  dir = upath.join(process.cwd(), dir);
  console.log('Converting: ' + dir);
  const files: string[] = [];
  walker(dir)
    .on('file', async (file: string) => {
      files.push(file);
    })
    .on('end', () => {
      files.forEach((file) => {
        switch (type) {
          case 'yml':
            toYml(file);
            break;
          case 'njk':
            toNjk(file);
            break;
        }
      });
    });
};
