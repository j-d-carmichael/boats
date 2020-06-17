const path = require('path')
const ucFirst = require('./ucFirst')
const UniqueOperationIds = require('./UniqueOperationIds');

const methodToPrefix = {
  get: 'read',
  post: 'modify',
  put: 'modify',
  delete: 'delete',
}

module.exports = (filePath, stripValue, tail) => {
  const opId = UniqueOperationIds.getUniqueOperationIdFromPath(filePath, stripValue, tail)
  const method = path.basename(filePath).replace(/\..*/, '').toLowerCase()
  const prefix = methodToPrefix[method] || 'modify'

  return `${prefix}${ucFirst(opId)}`
}
