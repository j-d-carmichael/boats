import upath from 'upath';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJson = require(upath.join(process.cwd(), 'package.json'));

export default (attribute: string): any => {
  if (typeof packageJson[attribute] === 'undefined') {
    throw new Error('Attribute not found in package.json file: ' + attribute);
  }
  return packageJson[attribute];
};
