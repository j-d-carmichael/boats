const _ = require('lodash')
const ucFirst = require('./ucFirst')
const lcFirst = require('./lcFirst')
const removeFileExtension = require('./removeFileExtension')

class UniqueOperationIds {
  /**
   *
   * @param filePath
   * @param stripValue
   * @param tail
   * @param cwd - Testing purposes only
   * @returns {string}
   */
  getUniqueOperationIdFromPath (filePath, stripValue, tail, cwd) {
    tail = tail || ''
    cwd = cwd || process.cwd()
    filePath = filePath.replace(cwd, '')
    filePath = removeFileExtension(filePath.replace(stripValue, ''))
    let filePathParts = filePath.split('/')
    for (let i = 0; i < filePathParts.length; ++i) {
      if (filePathParts[i] !== '/') {
        filePathParts[i] = ucFirst(_.camelCase(this.removeCurlys(filePathParts[i])))
      }
    }
    return lcFirst(filePathParts.join('')) + tail
  }

  /**
   * Strings the path param curlies from a folder name
   * @param input
   * @returns {*}
   */
  removeCurlys (input) {
    return input.replace('{', '').replace('}', '')
  }

  /**
   * Takes a bundled api json and ensures there are no duplicate operationIds
   * @param jsonInput
   */
  checkOpIdsAreAllUnique (jsonInput) {
    const opIds = {}
    const addId = (pathOrChannel, action, id) => {
      if (opIds[id] && ['publish', 'subscribe'].includes(action)) {
        const permitA = pathOrChannel + ' : publish'
        const permitB = pathOrChannel + ' : subscribe'
        if (opIds[id] === permitA || opIds[id] === permitB) {
          // handle
        } else {
          throw new Error(`AYNCAPI Duplicate operationId found:  ${pathOrChannel} : ${action} AND ${opIds[id]}`)
        }
      } else if (opIds[id]) {
        throw new Error(`OPENAPI Duplicate operationId found:  ${pathOrChannel} : ${action} AND ${opIds[id]}`)
      }
      opIds[id] = pathOrChannel + ' : ' + action
    }
    if (jsonInput.asyncapi) {
      for (let channelsKey in jsonInput.channels) {
        if (jsonInput.channels[channelsKey].publish) {
          if (!jsonInput.channels[channelsKey].publish.operationId) {
            throw new Error('Channel publish found without an operationId: ' + channelsKey)
          }
          addId(channelsKey, 'publish', jsonInput.channels[channelsKey].publish.operationId)
        }
        if (jsonInput.channels[channelsKey].subscribe) {
          if (!jsonInput.channels[channelsKey].subscribe.operationId) {
            throw new Error('Channel subscribe found without an operationId: ' + channelsKey)
          }
          addId(channelsKey, 'subscribe', jsonInput.channels[channelsKey].subscribe.operationId)
        }
      }
    } else {
      // we assume at this point all validation on api file type has happened.
      for (let pathsKey in jsonInput.paths) {
        for (let method in jsonInput.paths[pathsKey]) {
          if (!jsonInput.paths[pathsKey][method].operationId) {
            throw new Error('Path method found without an operationId: ' + method + ':' + pathsKey)
          }
          addId(pathsKey, method, jsonInput.paths[pathsKey][method].operationId)
        }
      }
    }
    return
  }
}

module.exports = new UniqueOperationIds()
