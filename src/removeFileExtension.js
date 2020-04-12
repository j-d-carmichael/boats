const stripFromEnd = require('./stripFromEndOfString')
module.exports = (filePath) => {
  filePath = stripFromEnd(filePath, '.njk')
  filePath = stripFromEnd(filePath, '.yml')
  return filePath
}
