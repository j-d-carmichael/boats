const path = require("path")
const YAML = require('js-yaml')
const fs = require('fs-extra')
const getFilePath = require('./getOutputName')

module.exports = async (inputFile, outputFile, options = {}, indentation = 2, excludeVersion) => {
  const SwaggerParser = require('swagger-parser')
  let bundled
  try{
    bundled = await SwaggerParser.bundle(inputFile, options)
  } catch (e) {
    console.log('>>>>',e)
  }

  let contents
  if (path.extname(outputFile) === '.json') {
    contents = JSON.stringify(bundled, null, indentation)
  } else {
    contents = YAML.safeDump(bundled, indentation)
  }
  fs.ensureDirSync(path.dirname(outputFile))
  return fs.writeFileSync(
    getFilePath(
      outputFile,
      bundled,
      excludeVersion
    ),
    contents
  )
}
