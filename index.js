const program = require('commander')
const Bundler = require('./es5/Bundler')
const pkg = require('./package.json')

program
  .version(pkg.version, '-v, --version')
  .option('--init', 'Inject a skeleton yml structure to the current directory named /src/...')

  .option('-i, --input [path]', 'The relative path to the main input file eg "./src/index.yml"')

  .option('-o, --output [path]', 'Path to the target eg "./build/weather_api". The version of the api will be appended automatically based on the version from within the OA index if present. If option not passed the output will be in the terminal.')

  .option('-x, --exclude_version', 'Exclude the OA version from the generated output file.')

  .option('-f, --output_format [format]', 'The output format yaml, yml or json. If not provided it will assume the format of the input file')

  .option('-e, --extension [ext]', 'The output extension, defaults to the output format if not provided. This is typically used to for the "yml" or "yaml" ext.')

  .option('-I, --indentation [indent]', 'The numeric indentation, defaults to 2 if option passed')

  .option('-u, --unique_operation_ids', '// WARNING: modifies your files, check with git: Changes the value of all operationId to the camelCase pathname of the file minus the dir path then continues to the usual operation of bundling.')

  .option('-U, --unique_operation_ids_only', 'Same as -m but will only inject the uniqueOperationIds into the yaml file and then stop')

  .option('-s, --strip_value [strip]', 'Related to u & U, the value removed from the file path for the uniqueIds, defaults to src/paths/')

  .option('-v, --validate [state]', 'Validate OA 2/3 state "on" or "off". Defaults to "on"')

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
  const bundler = new Bundler(program)
  bundler[(['yaml', 'yml'].indexOf(calculateOutputFormat()) !== -1) ? 'toYamlFile' : 'toJsonFile'](
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
