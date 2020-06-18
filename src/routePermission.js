const path = require('path')
const ucFirst = require('./ucFirst')
const UniqueOperationIds = require('./UniqueOperationIds')

module.exports = (boatsrc, filePath, stripValue, tail) => {
  const permissionConfig = boatsrc && boatsrc.permissionConfig && boatsrc.permissionConfig.routePrefix
  const prefixConfig = Object.assign(
    {
      get: 'read',
      post: 'create',
      put: 'update',
      patch: 'update',
      delete: 'delete',
    },
    permissionConfig
  )
  const opId = UniqueOperationIds.getUniqueOperationIdFromPath(filePath, stripValue, tail)
  const method = path.basename(filePath).replace(/\..*/, '').toLowerCase()
  const prefix = prefixConfig[method] || method

  return `${prefix}${ucFirst(opId)}`
}
