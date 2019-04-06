const SwaggerChunk = require('./es5/SwaggerChunk.js')

const chunk = new SwaggerChunk({
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
    chunk
      .toYamlFile('./build', 'builtOA2')
      .then(() => {
        chunk
          .toYamlFile()
          .then(() => {
            console.log('Building json')
            chunk
              .toJsonFile('./build', 'builtOA2')
              .then(() => {
                chunk.toJsonFile()
              }).catch(e => console.error(e))
          }).catch(e => console.error(e))
      }).catch(e => console.error(e))
  })
  .catch(e => {
    console.error('Error injecting uniqueOperationIds: ', e)
  })
