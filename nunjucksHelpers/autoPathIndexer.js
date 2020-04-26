const AutoPathIndexer = require('../src/AutoIndexer')

module.exports = function () {
  return AutoPathIndexer.getIndexYaml(this.env.globals.currentFilePointer, {
    paths: true
  })
}
