/**
 * Breaks strings on = sign and returns as a key value object into the arr arg
 * @param val The value to parse
 * @param arr Always an array is given
 * @returns {*}
 */
export default (val: string, arr: any[]): any[] => {
  const parts = val.split('=');
  const obj: any = {};
  if (parts.length === 1) {
    obj[parts[0].trim()] = true;
  } else {
    obj[parts.shift().trim()] = parts.join().trim();
  }
  arr.push(obj);
  return arr;
};
