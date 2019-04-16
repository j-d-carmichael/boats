const UniqueOperationIds = require('../es5/UniqueOperationIds')

module.exports = function () {
  return UniqueOperationIds.getUniqueOperationIdFromPath(this.env.globals.currentFilePointer, this.env.globals.uniqueOpIdStripValue)
}
