import path from 'path'
import ucFirst from './ucFirst'
import lcFirst from './lcFirst'

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
    filePath = this.removeFileExtension(filePath.replace(stripValue, ''))
    let filePathParts = filePath.split('/')
    for (let i = 0; i < filePathParts.length; ++i) {
      if (i !== 0) {
        filePathParts[i] = ucFirst(filePathParts[i])
      }
    }
    return lcFirst(filePathParts.join(''))
  }

  /**
   *
   * @param filePath
   * @returns {*|void|string|never}
   */
  removeFileExtension (filePath) {
    return filePath.replace(path.extname(filePath), '')
  }
}

export default new UniqueOperationIds()
