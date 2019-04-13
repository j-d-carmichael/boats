const bundlerSwaggerParse = require('./es5/bundlerSwaggerParse')
const Template = require('./es5/Template.js')
const validate = require('./es5/validate')

const program = {
  input: './srcOA3M/index.yml',
  output: './build/bundled.yml',
  indentation: 2,
  strip_value: 'srcOA3M/paths/'
}

const swagBundle = (inputFile) => {
  bundlerSwaggerParse(inputFile, program.output, {}, program.indentation)
    .catch(e => console.error('Bundler error', e))
}

// parse
Template.directoryParse(program.input, program.output, program.indentation, program.strip_value)
  .then((returnFile) => {
    validate(returnFile)
      .then(swagBundle(returnFile))
      .catch(e => console.error('Validation error', e))
  }).catch((err) => console.error(err))
