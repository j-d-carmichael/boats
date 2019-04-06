const program = require('commander')
const SwaggerChunk = require('./es5/SwaggerChunk')
const pkg = require('./package.json')

program
  .version(pkg.version, '-v, --version')
  .option('--init', 'Inject a skeleton yml structure to the current directory named /src/...')
  .option('-i, --input [path]', 'The relative path to the input file')
  .option('-c, --clean_leaf', 'This will strip all trailing "," from all values')
  .option('-d, --destination_name [name]', 'Base name of the file eg "weather_api". The version number from the swagger file will be appended automatically unless instructed otherwise')
  .option('-D, --destination [path]', 'Path to the target eg "./build". If no destination directory is passed the output will be outputted in the terminal')
  .option('-e, --extension [ext]', 'The output extension, defaults to the output format if not provided')
  .option('-h, --host_replacement [name]', '(swagger2 specific only) A host name string to replace the one found in the source')
  .option('-o, --output_format [format]', 'The output format yaml, yml or json. If not provided it will assume the format of the input file')
  .option('-n, --indentation [indent]', 'The numeric indentation, defaults to 4 if nothing passed')
  .option('-m, --make_unique_operation_ids', '// WARNING: modifies your files, check with git: Changes the value of all operationId to the camelCase pathname of the file minus the dir path then continues to the usual operation of bundling.')
  .option('-M, --make_unique_operation_ids_only', 'Same as -m but will only inject the uniqueOperationIds into the yaml file and then stop')
  .option('-s, --strip_value [strip]', 'Related to m & M, the value removed from the file path for the uniqueIds, defaults to src/paths/')
  .option('-V, --validate_off', 'Do not validate the swagger output')
  .option('-x, --exclude_version', 'Exclude the swagger version from the generated output file')
  .parse(process.argv)

// Initialise a code base and exit
if (program.init) {
  return require('./init')
}

const bundle = () => {
  // Compile multiple files to one.
  const calculateOutputFormat = () => {
    return (program.output_format) ? program.output_format : program.input.split('.').pop()
  }
  const swaggerChunk = new SwaggerChunk(program)
  swaggerChunk[(['yaml', 'yml'].indexOf(calculateOutputFormat()) !== -1) ? 'toYamlFile' : 'toJsonFile'](
    program.destination,
    program.destination_name,
    program.extension || false
  ).then(() => {

  }).catch((err) => {
    console.error(err)
  })
}

// Inject uniqueOperationIds
if(program.make_unique_operation_ids || program.make_unique_operation_ids_only){
  const uniqueOperationIds = require('./es5/UniqueOperationIds')
  const UniqueOperationIds = new uniqueOperationIds(program)
  UniqueOperationIds
    .listAndInject()
    .then(() => {
      if(program.make_unique_operation_ids_only){
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
