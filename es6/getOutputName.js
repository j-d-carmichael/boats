import path from 'path'
import * as program from '../commander'
import fs from 'fs-extra'

export const getVersion = (jsonObj, excludeVersion) => {
  let swagVersion = ''
  if (excludeVersion) {
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

export const getFileName = (filePath, openApiJson, excludeVersion) => {
  const name = path.basename(filePath).replace(path.extname(filePath), '')
  return name + getVersion(openApiJson, excludeVersion) + path.extname(filePath)
}

export default (filePath, openApiJson, excludeVersion) => {
  return path.join(path.dirname(filePath), getFileName(filePath, openApiJson, excludeVersion))
}
