require('colors')
const fs = require('fs-extra')
const path = require('path')
const bundlerSwaggerParse = require('./bundlerSwaggerParse')
const Template = require('./Template')
const dotenvFilePath = path.join(process.cwd(), '.env')
const boatsrc = path.join(process.cwd(), '.boatsrc')
const checkVersion = require('npm-tool-version-check').default

// If a .env file exists call dotenv package to set into the env vars
if (fs.pathExistsSync(dotenvFilePath)) {
  require('dotenv').config({ path: dotenvFilePath })
}

const program = require('./commander')(process.argv)

const promise = process.env.NODE_ENV === 'test' ? Promise.resolve(true) : checkVersion(
  require('../package.json').version,
  'https://raw.githubusercontent.com/johndcarmichael/boats/master/package.json',
  'BOATS'
)

promise.then(async () => {

  console.log(``)

  if (program.convert_to_njk) {
    // Convert files to njk
    const convert = require('./convertToNunjucksOrYaml')
    convert(program.convert_to_njk, 'njk')
  } else if (program.convert_to_yml) {
    // Convert files to yaml
    const convert = require('./convertToNunjucksOrYaml')
    convert(program.convert_to_yml, 'yml')
  } else if (program.init) {
    // Return init function
    require('../init')
  } else {
    // parse the directory then validate and bundle with swagger-parser
    const returnFile = await Template.directoryParse(
      program.input,
      program.output,
      program.indentation,
      program.strip_value,
      program.variables,
      program.functions,
      boatsrc,
    )
    // bundle and validate
    const pathWrittenTo = await bundlerSwaggerParse(
      returnFile,
      program.output,
      {},
      program.indentation,
      program.exclude_version,
      program.dereference,
    )

    console.log('Completed, the files were rendered, validated and bundled to: '.green + pathWrittenTo.green.bold)
  }
}).catch(error => {
  console.trace(error)
})
