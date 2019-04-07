const program = require('commander')
const pkg = require('./package.json')

module.exports = () => {
  program
    .version(pkg.version, '-V, --version')
    .option('--init', 'Inject a skeleton yml structure to the current directory named /src/...')

    .option('-i, --input [path]', 'The relative path to the main input file eg "./src/index.yml"')

    .option('-o, --output [path]', 'Path to the target eg "./build/weather_api.json|yaml|yml". The version of the api will be injected automatically based on the version from within the OA index if present. If option not passed the output will be in the terminal.')

    .option('-x, --exclude_version', 'Exclude the OA version from the generated output file.')

    .option('-I, --indentation [indent]', 'The numeric indentation, defaults to 2 if option passed')

    .option('-u, --unique_operation_ids', 'Changes the value of all operationId to the camelCase pathname minus the --strip_value before bundling.')

    .option('-U, --unique_operation_ids_only', 'Same as -m but will only inject the uniqueOperationIds into the files and then stops.')

    .option('-s, --strip_value [strip]', 'Related to u & U, the value removed from the file path for the uniqueIds, defaults to src/paths/')

    .option('-v --validate <state>', 'Validate OA 2/3 state "on" or "off". Defaults to "on"', /^(on|off)$/i, 'on')

    .parse(process.argv)
  return program
}
