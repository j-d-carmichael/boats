const Bundler = require('./es5/Bundler.js')

const bundler = new Bundler({
  input: './srcOA2/index.yml',
})

const uniqueOperationIds = require('./es5/UniqueOperationIds')
const program = {
  make_unique_operation_ids: true,
  strip_value: 'srcOA2/paths/',
  input: './srcOA2/index.yml',
}
const UniqueOperationIds = new uniqueOperationIds(program)
UniqueOperationIds
  .listAndInject()
  .then(() => {
    bundler
      .toYamlFile('./build', 'builtOA2')
      .then(() => {
        bundler
          .toYamlFile()
          .then(() => {
            console.log('Building json')
            bundler
              .toJsonFile('./build', 'builtOA2')
              .then(() => {
                bundler.toJsonFile()
              }).catch(e => console.error(e))
          }).catch(e => console.error(e))
      }).catch(e => console.error(e))
  })
  .catch(e => {
    console.error('Error injecting uniqueOperationIds: ', e)
  })
