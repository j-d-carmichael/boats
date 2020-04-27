const AutoPathIndexer = require('../src/AutoIndexer')

module.exports = function (remove) {
  return AutoPathIndexer.getIndexYaml(this.env.globals.currentFilePointer, {
    components: true,
    remove
  })
}
