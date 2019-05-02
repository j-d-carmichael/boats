const boats = require('./index')
const path = require('path')

const program = {
  input: './srcOA3/index.yml',
  output: './build/builtOA3.yml',
  indentation: 2,
  strip_value: 'srcOA3/paths/'
}

// Parse, validate then bundle into 1 file.
boats.Template.directoryParse(
  program.input,
  program.output,
  program.indentation,
  program.strip_value,
  [],
  undefined,
  path.join(process.cwd(), '.boatsrc')
)
  .then((returnFile) => {
    boats.validate(returnFile)
      .then(() => {
        boats.bundlerSwaggerParse(returnFile, program.output, {}, program.indentation)
          .catch(e => console.error('Bundle error', e))
      })
      .catch(e => console.error('Validation error', e))
  }).catch((err) => console.error(err))
