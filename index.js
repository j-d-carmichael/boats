const path = require('path')
const Bundler = require('./es5/Bundler')
const bundlerSwaggerParse = require('./es5/bundlerSwaggerParse')
const Template = require('./es5/Template')
const validate = require('./es5/validate')
const program = require('./commander')()
const fs = require('fs-extra')
const dotenvFilePath = path.join(process.cwd(), '.env')

// If a .env file exists call dotenv package to set into the env vars
if (fs.pathExistsSync(dotenvFilePath)) {
  require('dotenv').config({ path: dotenvFilePath })
}

// Return init function
if (program.init) {
  require('./init')
} else if (program.json_refs) {
  // Start json refs bundler
  const calculateOutputFormat = () => {
    return program[(program.output) ? 'output' : 'input'].split('.').pop()
  }
  const bundler = new Bundler(program)
  bundler[(['yaml', 'yml'].indexOf(calculateOutputFormat()) !== -1) ? 'toYamlFile' : 'toJsonFile'](program.output)
    .then(() => {
      // Nothing to do as all handled in the bundler
    }).catch(err => console.error(err))
} else {
  // parse the directory then validate and bundle with swagger-parser
  const swagBundle = (inputFile) => {
    bundlerSwaggerParse(inputFile, program.output, {}, program.indentation)
      .catch(e => console.error('Bundler error', e))
  }
  Template.directoryParse(program.input, program.output, program.indentation, program.strip_value, program.variables)
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
