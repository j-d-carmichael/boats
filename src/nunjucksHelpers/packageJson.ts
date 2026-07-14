import upath from 'upath';

let packageJson: Record<string, any>;

export default (attribute: string): any => {
  if (!packageJson) {
    const packageJsonPath = upath.join(process.cwd(), 'package.json');
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      packageJson = require(packageJsonPath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new Error('The packageJson helper could not read the package.json file expected at: ' + packageJsonPath);
    }
  }
  if (typeof packageJson[attribute] === 'undefined') {
    throw new Error('Attribute not found in package.json file: ' + attribute);
  }
  return packageJson[attribute];
};
