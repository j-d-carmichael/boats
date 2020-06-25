import fs from 'fs-extra'
import path from 'path'

/**
 * Breaks strings on = sign and returns as a key value object into the arr arg
 * @param val The value to parse
 * @param arr Always an array is given
 * @returns {*}
 */
export default (val: any, arr: any[]): any[] => {
  const filePath = path.join(process.cwd(), val)
  if (!fs.pathExistsSync(filePath)) {
    throw new Error('Helper function could not be found: ' + filePath)
  }
  arr.push(filePath)
  return arr
}
