const _ = require('lodash')
const ucFirst = require('./ucFirst')
const lcFirst = require('./lcFirst')
const removeFileExtension = require('./removeFileExtension')

class UniqueOperationIds {
  /**
   *
   * @param filePath
   * @param stripValue
   * @param cwd
   * @returns {string}
   */
  getUniqueOperationIdFromPath (filePath, stripValue, cwd) {
    cwd = cwd || process.cwd()
    filePath = filePath.replace(cwd, '')
    filePath = removeFileExtension(filePath.replace(stripValue, ''))
    let filePathParts = filePath.split('/')
    for (let i = 0; i < filePathParts.length; ++i) {
      if (filePathParts[i] !== '/') {
        filePathParts[i] = ucFirst(_.camelCase(this.removeCurlys(filePathParts[i])))
      }
    }
    return lcFirst(filePathParts.join(''))
  }

  removeCurlys (input) {
    return input.replace('{', '').replace('}', '')
  }
}

module.exports = new UniqueOperationIds()
