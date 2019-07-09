/**
 * Clones an object and returns
 */
module.exports = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
