import path from "path"
import * as YAML from 'js-yaml'
import fs from 'fs-extra'
import getFilePath from './getOutputName'

export default async (inputFile, outputFile, options = {}, indentation = 2) => {
  const SwaggerParser = require('swagger-parser')
  const bundled = await SwaggerParser.bundle(inputFile, options)
  let contents
  if (path.extname(outputFile) === '.json') {
    contents = JSON.stringify(bundled, null, indentation)
  } else {
    contents = YAML.safeDump(bundled, indentation)
  }
  fs.ensureDirSync(path.dirname(outputFile))
  return fs.writeFileSync(getFilePath(outputFile, bundled), contents)
}
