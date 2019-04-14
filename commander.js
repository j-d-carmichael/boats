const program = require('commander')
const pkg = require('./package.json')
const collect = require('./commander.collect')
module.exports = () => {
  program
    .option('--init', 'Inject a skeleton yml structure to the current directory named /src/...')

    .option('-i, --input [path]', 'The relative path to the main input file eg "./src/index.yml"')

    .option('-o, --output [path]', `The relative path to the main output file eg "./built/bundled.yml" 
                            (if json_refs is not used the output directory will also contain the compiled tpl files)`)

    .option('-x, --exclude_version', 'By default the OA version is injected into the file name, this option stops this happening.')

    .option('-j, --json_refs', 'If passed the json-refs bundler will be used instead of swagger-parser\'s bundler.')

    .option('-I, --indentation <indent>', 'The numeric indentation, defaults to 2 if option passed', 2)

    .option('-s, --strip_value [strip]', 'The value removed from during creation of the uniqueOpId tpl function, defaults to "paths/"')

    .option('-v --validate <state>', 'Validate OA 2/3 state "on" or "off". Defaults to "on"', /^(on|off)$/i, 'on')

    .option('-$, --variables [value]', 'Array of variables to pass to the templates, eg "-$ host=http://somehost.com -$ apikey=321654987"', collect, [])

    .version(pkg.version, '-V, --version')

    .parse(process.argv)
  return program
}
