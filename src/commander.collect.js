/**
 * Breaks strings on = sign and returns as a key value object into the arr arg
 * @param val The value to parse
 * @param arr Always an array is given
 * @returns {*}
 */
module.exports = (val, arr) => {
  let parts = val.split('=')
  let obj = {}
  if (parts.length === 1) {
    obj[parts[0].trim()] = true
  } else {
    obj[parts.shift().trim()] = parts.join().trim()
  }
  arr.push(obj)
  return arr
}
