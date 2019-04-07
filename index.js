const Bundler = require('./es5/Bundler')
const program = require('./commander')()

// Initialise a code base and exit
if (program.init) {
  return require('./init')
}

const bundle = () => {
  const calculateOutputFormat = () => {
    return program[(program.output) ? 'output' :'input'].split('.').pop()
  }
  const bundler = new Bundler(program)
  bundler[(['yaml', 'yml'].indexOf(calculateOutputFormat()) !== -1) ? 'toYamlFile' : 'toJsonFile'](
    program.output || false,
  ).then(() => {
    // Nothing to do as all handled in the bundler
  }).catch((err) => {
    console.error(err)
  })
}

// Inject uniqueOperationIds
if(program.unique_operation_ids || program.unique_operation_ids_only){
  const uniqueOperationIds = require('./es5/UniqueOperationIds')
  const UniqueOperationIds = new uniqueOperationIds(program)
  UniqueOperationIds
    .listAndInject()
    .then(() => {
      if(program.unique_operation_ids_only){
        process.exit(0)
      }
      bundle()
    })
    .catch(e => {
      console.error('Error injecting uniqueOperationIds: ', e)
    })
} else {
  bundle()
}
