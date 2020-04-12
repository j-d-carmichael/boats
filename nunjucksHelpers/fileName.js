const removeFileExtension = require('../src/removeFileExtension')

module.exports = function (withFileExt) {
  let base = (this.env.globals.currentFilePointer.split('/')).pop()
  if (withFileExt) {
    return base
  }
  return removeFileExtension(base)
}
