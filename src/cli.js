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

checkVersion(
  require('../package.json').version,
  'https://raw.githubusercontent.com/johndcarmichael/boats/master/package.json',
  'BOATS'
).then(() => {
  const program = require('./commander')(process.argv)

  const swagBundle = async (inputFile, validate) => {
    try {
      return await bundlerSwaggerParse(
        inputFile,
        program.output,
        {},
        program.indentation,
        program.exclude_version,
        program.dereference,
        validate
      )
    } catch (e) {
      console.error('Bundler error', e)
    }
  }

  if (program.convert_to_njk) {
    console.log(program.convert_to_njk)
    const convert = require('./convertToNunjucksOrYaml')
    convert(program.convert_to_njk, 'njk')
  } else if (program.convert_to_yml) {
    console.log(program.convert_to_njk)
    const convert = require('./convertToNunjucksOrYaml')
    convert(program.convert_to_yml, 'yml')
  } else if (program.init) {
    // Return init function
    require('../init')
  } else {
    // parse the directory then validate and bundle with swagger-parser
    Template.directoryParse(
      program.input
      , program.output
      , program.indentation
      , program.strip_value
      , program.variables
      , program.functions
      , boatsrc
    )
      .then(async (returnFile) => {
        await swagBundle(returnFile, program.validate)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}).catch(() => {
  process.exit(0)
})
