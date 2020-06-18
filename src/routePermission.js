const path = require('path')
const ucFirst = require('./ucFirst')
const UniqueOperationIds = require('./UniqueOperationIds');

const methodToPrefix = {
  get: 'read',
  post: 'manage',
  put: 'manage',
  patch: 'manage',
  delete: 'delete',
}

module.exports = (filePath, stripValue, tail) => {
  const opId = UniqueOperationIds.getUniqueOperationIdFromPath(filePath, stripValue, tail)
  const method = path.basename(filePath).replace(/\..*/, '').toLowerCase()
  const prefix = methodToPrefix[method] || 'manage'

  return `${prefix}${ucFirst(opId)}`
}
