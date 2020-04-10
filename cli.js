const fs = require('fs-extra')
const path = require('path')
const bundlerSwaggerParse = require('./src/bundlerSwaggerParse')
const Template = require('./src/Template')
const validate = require('./src/validate')
const dotenvFilePath = path.join(process.cwd(), '.env')
const boatsrc = path.join(process.cwd(), '.boatsrc')
const checkVersion = require('npm-tool-version-check').default

// If a .env file exists call dotenv package to set into the env vars
if (fs.pathExistsSync(dotenvFilePath)) {
  require('dotenv').config({ path: dotenvFilePath })
}

checkVersion(
  require('./package.json').version,
  'https://raw.githubusercontent.com/johndcarmichael/boats/master/package.json',
  'BOATS'
).then(() => {
  const program = require('./commander')(process.argv)
  if (program.init) {
    // Return init function
    require('./init')
  } else {
    // parse the directory then validate and bundle with swagger-parser
    const swagBundle = async (inputFile) => {
      try {
        return await bundlerSwaggerParse(
          inputFile,
          program.output,
          {},
          program.indentation,
          program.exclude_version,
          program.dereference
        )
      } catch (e) {
        console.error('Bundler error', e)
      }
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
      .then(async (returnFile) => {
        const writtenOutFilePath = await swagBundle(returnFile)
        if (program.validate === 'on') {
          if (program.type) {
            if (program.type === 'asyncapi') {
              await validate.asyncapi(
                fs.readFileSync(writtenOutFilePath).toString()
              )
            } else if (['openapi', 'swagger'].indexOf(program.type) !== -1) {
              await validate.openapi(returnFile)
            }
          }
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }
}).catch(() => {
  process.exit(0)
})
