const bundlerSwaggerParse = require('./es5/bundlerSwaggerParse')
const Template = require('./es5/Template.js')
const validate = require('./es5/validate')

const program = {
  input: './srcOA3/index.yml',
  output: './build/builtOA3.yml',
  indentation: 2,
  exclude_version: true,
  strip_value: 'srcOA3/paths/'
}

// Parse, validate then bundle into 1 file.
Template.directoryParse(program.input, program.output, program.indentation, program.strip_value)
  .then((returnFile) => {
    validate(returnFile)
      .then(() => {
        bundlerSwaggerParse(returnFile, program.output, {}, program.indentation, program.exclude_version)
          .catch(e => console.error('Bundle error', e))
      })
      .catch(e => console.error('Validation error', e))
  }).catch((err) => console.error(err))
