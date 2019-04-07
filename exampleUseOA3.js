const Bundler = require('./es5/Bundler.js')

const bundler = new Bundler({
  input: './srcOA3/index.yml',
})

const uniqueOperationIds = require('./es5/UniqueOperationIds')
const program = {
  unique_operation_ids: true,
  strip_value: 'srcOA3/paths/',
  input: './srcOA3/index.yml',
}

const UniqueOperationIds = new uniqueOperationIds(program)
UniqueOperationIds
  .listAndInject()
  .then(() => {
    console.log('Building yaml')
    bundler
      .toYamlFile('./build/builtOA3.yml')
      .then(() => {
        bundler
          .toYamlFile()
          .then(() => {
            console.log('Building json')
            bundler
              .toJsonFile('./build/builtOA3.json')
              .then(() => {
                bundler.toJsonFile()
              }).catch(e => console.error(e))
          }).catch(e => console.error(e))
      }).catch(e => console.error(e))
  })
  .catch(e => {
    console.error('Error injecting uniqueOperationIds: ', e)
  })
