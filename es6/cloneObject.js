/**
 * Clones an object and returns
 */
export default (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
