import path from 'path'
import * as program from '../commander'
import fs from 'fs-extra'

const getVersion = (jsonObj, appendVersion) => {
  let swagVersion = ''
  if (!appendVersion) {
    return swagVersion
  }
  if (jsonObj.info.version) {
    swagVersion = jsonObj.info.version
  } else if (!program.Version) {
    let packageJson
    try {
      packageJson = JSON.parse(fs.readFileSync('./package.json'))
    } catch (e) {
      packageJson = {}
    }
    if (packageJson.version) {
      swagVersion = packageJson.version
    } else {
      return swagVersion
    }
  }
  return '_' + swagVersion
}

export const getFileName = (filePath, openApiJson, appendVersion) => {
  const name = path.basename(filePath).replace(path.extname(filePath), '')
  return name + getVersion(openApiJson, appendVersion) + path.extname(filePath)
}

export default (filePath, openApiJson, appendVersion) => {
  return path.join(path.dirname(filePath), getFileName(filePath, openApiJson, appendVersion))
}
