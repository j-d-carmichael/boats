const bundlerSwaggerParse = require('./es5/bundlerSwaggerParse')
const Template = require('./es5/Template.js')
const validate = require('./es5/validate')

const program1 = {
  input: './srcOA3/index.yml',
  output: './build/builtOA3.yml',
  indentation: 2,
  strip_value: 'srcOA3/paths/'
}

const program2 = {
  input: './srcOA3/index.yml',
  output: './build/builtOA3.json',
  indentation: 2,
  strip_value: 'srcOA3/paths/'
}


const testOpenAPISpecMultifile = (program) => {
  return new Promise((resolve, reject)=>{
    const swagBundle = (inputFile) => {
      bundlerSwaggerParse(inputFile, program.output, {}, program.indentation)
        .then(resolve)
        .catch(e => console.error('Bundler error', e))
    }

    // parse
    Template.directoryParse(program.input, program.output, program.indentation, program.strip_value)
      .then((returnFile) => {
        validate(returnFile)
          .then(swagBundle(returnFile))
          .catch(e => console.error('Validation error', e))
      }).catch((err) => console.error(err))
  })
}

testOpenAPISpecMultifile(program1)
  .then(() => {
    testOpenAPISpecMultifile(program2)
  })
