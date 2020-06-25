import path from 'path'
import fs from 'fs-extra'

const program = require('./commander')

const getVersion = (jsonObj: any, excludeVersion: boolean): string => {
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

const getFileName = (filePath: string, openApiJson: any, excludeVersion: boolean): string => {
  const name = path.basename(filePath).replace(path.extname(filePath), '')
  return name + getVersion(openApiJson, excludeVersion) + path.extname(filePath)
}

export default (filePath: string, openApiJson: any, excludeVersion: boolean): string => {
  return path.join(path.dirname(filePath), getFileName(filePath, openApiJson, excludeVersion))
}
