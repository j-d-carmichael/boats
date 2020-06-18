const routePermission = require('../src/routePermission')

module.exports = function (tail) {
  return routePermission(
    this.env.globals.boatsConfig,
    this.env.globals.currentFilePointer,
    this.env.globals.uniqueOpIdStripValue,
    tail,
  );
}
