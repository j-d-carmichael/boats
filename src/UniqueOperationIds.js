const path = require('path');
const camelcase = require('camelcase');
const ucFirst = require('./ucFirst');
const lcFirst = require('./lcFirst');

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
    filePath = filePath.replace(cwd, '');
    filePath = this.removeFileExtension(filePath.replace(stripValue, ''));
    let filePathParts = filePath.split('/');
    for (let i = 0; i < filePathParts.length; ++i) {
      if (filePathParts[i] !== '/') {
        filePathParts[i] = ucFirst(camelcase(filePathParts[i]));
      }
    }
    return lcFirst(filePathParts.join(''));
  }

  /**
   *
   * @param filePath
   * @returns {*|void|string|never}
   */
  removeFileExtension (filePath) {
    return filePath.replace(path.extname(filePath), '');
  }
}

module.exports = new UniqueOperationIds();
