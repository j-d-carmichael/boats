import fs from 'fs-extra';
import upath from 'upath';

/**
 * Breaks strings on = sign and returns as a key value object into the arr arg
 * @param val The value to parse
 * @param arr Always an array is given
 * @returns {*}
 */
export default (val: string, arr: any[]): any[] => {
  const filePath = upath.join(process.cwd(), val);
  if (!fs.pathExistsSync(filePath)) {
    throw new Error('Helper function could not be found: ' + filePath);
  }
  arr.push(filePath);
  return arr;
};
