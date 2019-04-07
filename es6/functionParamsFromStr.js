/**
 *
 * @param string
 * @returns {Array}
 */
export default (string) => {
  if (string[0] === '\'') string = string.substring(1, string.length)
  if (string[string.length - 1] === '\'') string = string.substring(0, (string.length - 1))
  string = string.trim()
  string = string.replace('mixin(', '')
  string = string.substring(0, (string.length - 1))
  let paramsArray = []
  let parts = string.split(',')
  parts.forEach((part) => {
    let item = part.trim()
    let a = (item[0] === '\'' || item[0] === '"') ? 1 : 0
    let b = (item[item.length - 1] === '\'' || item[item.length - 1] === '"') ? item.length - 1 : item.length - 0
    item = item.substring(a, b)
    paramsArray.push(item)
  })
  return paramsArray
}
