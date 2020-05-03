const UniqueOperationIds = require('../src/UniqueOperationIds')

module.exports = function (tail) {
  return UniqueOperationIds.getUniqueOperationIdFromPath(this.env.globals.currentFilePointer, this.env.globals.uniqueOpIdStripValue, tail)
}
