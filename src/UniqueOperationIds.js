const camelcase = require('camelcase');
const ucFirst = require('./ucFirst');
const lcFirst = require('./lcFirst');
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
    cwd = cwd || process.cwd();
    console.log(filePath)
    filePath = filePath.replace(cwd, '');
    filePath = removeFileExtension(filePath.replace(stripValue, ''));
    console.log(filePath)
    let filePathParts = filePath.split('/');
    for (let i = 0; i < filePathParts.length; ++i) {
      if (filePathParts[i] !== '/') {
        filePathParts[i] = ucFirst(camelcase(filePathParts[i]));
      }
    }
    return lcFirst(filePathParts.join(''));
  }
}

module.exports = new UniqueOperationIds();
