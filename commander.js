const program = require('commander')
const pkg = require('./package.json')

function collect(val, memo) {
  let parts = val.split('=')
  let obj = {}
  if(parts.length === 1){
    obj[parts[0].trim()] = true
  } else {
    obj[parts.shift().trim()] = parts.join().trim();
  }
  memo.push(obj);
  return memo;
}

module.exports = () => {
  program
    .version(pkg.version, '-V, --version')
    .option('--init', 'Inject a skeleton yml structure to the current directory named /src/...')

    .option('-i, --input [path]', 'The relative path to the main input file eg "./src/index.yml"')

    .option('-o, --output [path]', 'Path to the target eg "./build/weather_api.json|yaml|yml". The version of the api will be injected automatically based on the version from within the OA index if present. If option not passed the output will be in the terminal.')

    .option('-x, --exclude_version', 'Exclude the OA version from the generated output file.')

    .option('-I, --indentation [indent]', 'The numeric indentation, defaults to 2 if option passed')

    .option('-s, --strip_value [strip]', 'The value removed from during creation of the uniqueOpId tpl function, defaults to "paths/"')

    .option('-v --validate <state>', 'Validate OA 2/3 state "on" or "off". Defaults to "on"', /^(on|off)$/i, 'on')

    .option('-$, --variables [value]', 'Array of variables to pass to the templates, eg "-$ host=http://somehost.com -$ apikey=321654987"', collect, [])

    .parse(process.argv)
  return program
}
