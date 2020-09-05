import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(path.join(process.cwd(), 'package.json'));

export default (attribute: string): any => {
  if (typeof packageJson[attribute] === 'undefined') {
    throw new Error('Attribute not found in package.json file: ' + attribute);
  }
  return packageJson[attribute];
};
