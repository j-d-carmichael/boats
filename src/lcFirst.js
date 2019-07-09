/**
 *
 * @param string to ucfirst
 * @returns {string}
 */
module.exports = (string) => {
  if (typeof string !== 'string') {
    throw new Error('Param passed to ucfirst is not type string but type: ' + typeof string)
  }
  if(string.length === 0){
    return string
  }
  if(string.length === 1){
    return string.toLocaleLowerCase()
  }
  return string.charAt(0).toLocaleLowerCase() + string.slice(1)
}
