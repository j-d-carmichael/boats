import path from 'path'
import fs from 'fs-extra'
import { JSON } from '@/interfaces/BoatsRc';

const getVersion = (jsonObj: JSON, excludeVersion: boolean): string => {
  let swagVersion = ''
  if (excludeVersion) {
    return swagVersion
  }
  if (jsonObj.info.version) {
    swagVersion = jsonObj.info.version
  } else {
    let packageJson
    try {
      packageJson = JSON.parse(fs.readFileSync('./package.json').toString('utf8'))
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

const getFileName = (filePath: string, openApiJson: JSON, excludeVersion: boolean): string => {
  const name = path.basename(filePath).replace(path.extname(filePath), '')
  return name + getVersion(openApiJson, excludeVersion) + path.extname(filePath)
}

export default (filePath: string, openApiJson: JSON, excludeVersion: boolean): string => {
  return path.join(path.dirname(filePath), getFileName(filePath, openApiJson, excludeVersion))
}
