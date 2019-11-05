const path = require('path')
const bundlerSwaggerParse = require('./src/bundlerSwaggerParse')
const Template = require('./src/Template')
const validate = require('./src/validate')
const program = require('./commander')()
const fs = require('fs-extra')
const dotenvFilePath = path.join(process.cwd(), '.env')
const boatsrc = path.join(process.cwd(), '.boatsrc')

// If a .env file exists call dotenv package to set into the env vars
if (fs.pathExistsSync(dotenvFilePath)) {
  require('dotenv').config({ path: dotenvFilePath })
}

if (program.init) {
  // Return init function
  require('./init')
} else {
  // parse the directory then validate and bundle with swagger-parser
  const swagBundle = (inputFile) => {
    bundlerSwaggerParse(
      inputFile,
      program.output,
      {},
      program.indentation,
      program.exclude_version,
      program.dereference
    )
      .catch(e => console.error('Bundler error', e))
  }
  Template.directoryParse(
    program.input
    , program.output
    , program.indentation
    , program.strip_value
    , program.variables
    , program.functions
    , boatsrc
  )
    .then((returnFile) => {
      if (program.validate === 'on') {
        validate(returnFile)
          .then(swagBundle(returnFile))
          .catch(e => console.error('Validation error', e))
      } else {
        swagBundle(returnFile)
      }
    }).catch((err) => console.error(err))
}
