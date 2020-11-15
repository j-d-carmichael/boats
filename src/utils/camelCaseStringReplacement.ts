/**
 *
 * @param input
 * @param {string|array} replace - String or array of string replacements
 * @return {string}
 */
import lcFirst from '@/lcFirst';
import ucFirst from '@/ucFirst';

export default (input: string, replace: string | string[]): string => {
  if (typeof replace === 'string') {
    replace = [replace];
  }
  if (!Array.isArray(replace)) {
    throw Error('The replace values must be either a string or an array of strings.');
  }
  let returnString = '';
  replace.forEach((replaceItem, i) => {
    const replaceInString = (i === 0) ? input : returnString;
    returnString = lcFirst((replaceInString.split(replaceItem).map((part) => {
      return ucFirst(part);
    })).join(''));
  });
  return returnString;
};
