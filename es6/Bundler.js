import Mixin from './Mixin'
import * as program from 'commander'
import fs from 'fs-extra'
import path from 'path'

const resolveRefs = require('json-refs').resolveRefs
const YAML = require('js-yaml')
const dd = require('../dd')

export default class Bundler {

  /**
   * @param program
   * {
   *  input: string,
   *  appendVersion:   ? bool defaults to false
   * }
   */
  constructor (program = {}) {
    if (!program.input) {
      dd('No input provided')
    } else {
      if (!fs.existsSync(program.input)) {
        dd('File does not exist. (' + program.input + ')')
      }
    }
    this.mainJSON = ''
    this.appendVersion = (program.exclude_version !== true)
    this.input = program.input
    this.validate = (program.validate === 'on')
    this.output = program.output || false
    this.indentation = program.indentation || 2
    this.originalIndentation = program.originalIndentation || 2
  }

  readJsonFile (file) {
    try {
      return JSON.parse(fs.readFileSync(file))
    } catch (err) {
      return null
    }
  }

  packageJson () {
    return this.readJsonFile('./package.json')
  }

  parseMainLoaderOptions () {
    return {
      loaderOptions: {
        processContent: (res, callback) => {
          try {
            Mixin.injector(res.text, res.location, this.originalIndentation)
              .then((text) => {
                callback(null, YAML.safeLoad(text))
              })
              .catch(dd)
          } catch (e) {
            dd({
              msg: 'Error parsing yml',
              e: e
            })
          }
        }
      }
    }
  }

  parseMainRoot () {
    return YAML.safeLoad(fs.readFileSync(this.input).toString())
  }

  parseMain () {
    return new Promise((resolve) => {
      const root = this.parseMainRoot()
      const pwd = process.cwd()
      process.chdir(path.dirname(this.input))
      resolveRefs(root, this.parseMainLoaderOptions()).then((results) => {
        this.mainJSON = results.resolved
        this.validator()
          .then(() => {
            process.chdir(pwd)
            return resolve(this.mainJSON)
          })
          .catch(dd)
      })
        .catch(dd)
    })
  }

  validator () {
    return new Promise((resolve, reject) => {
      if (!this.validate) {
        const SwaggerParser = require('swagger-parser')
        SwaggerParser.validate(this.cloneObject(this.mainJSON), {}, (e) => {
          if (e) {
            return reject(e.message)
          }
          return resolve()
        }).catch(reject)
      } else {
        return resolve()
      }
    })
  }

  cloneObject (src) {
    return JSON.parse(JSON.stringify(src))
  }

  lastChar (string) {
    return string[string.length - 1]
  }

  removeLastChar (str) {
    return str.slice(0, -1)
  }

  getVersion () {
    let swagVersion = ''
    if (!this.appendVersion) {
      return swagVersion
    }
    let parsedResltObj = this.mainJSON
    if (parsedResltObj.info.version) {
      swagVersion = parsedResltObj.info.version
    } else if (!program.Version) {
      const packageJson = (this.packageJson())
      if (packageJson.version) {
        swagVersion = packageJson.version
      } else {
        return swagVersion
      }
    }
    return '_' + swagVersion
  }

  getFileName (filePath) {
    const name = path.basename(filePath).replace(path.extname(filePath), '')
    return name + this.getVersion() + path.extname(filePath)
  }

  getFilePath (filePath) {
    return path.join(path.dirname(filePath), this.getFileName(filePath))
  }

  writeFile (filePath, contents) {
    try {
      fs.ensureDirSync(path.dirname(filePath))
      return fs.writeFileSync(this.getFilePath(filePath), contents)
    } catch (e) {
      dd({
        msg: 'Error writing file',
        e: e
      })
    }
  }

  toJsonFile (filePath) {
    this.output = filePath || false
    return new Promise((resolve, reject) => {
      this.toJSON().then((json) => {
        const jsonString = JSON.stringify(this.mainJSON, null, this.indentation)
        if (!this.destination) {
          console.log(jsonString)
          return resolve()
        }
        this.writeFile(filePath, jsonString)
        resolve('File written to: ' + this.getFilePath(filePath))
      }).catch(reject)
    })
  }

  toJSON () {
    return new Promise((resolve, reject) => {
      this.parseMain().then((json) => {
        return resolve(json)
      }).catch(reject)
    })
  }

  toYamlFile (filePath) {
    this.output = filePath || false
    return new Promise((resolve, reject) => {
      this.toYAML().then((yml) => {
        if (!this.output) {
          console.log(yml)
          return resolve()
        }
        this.writeFile(filePath, yml)
        resolve('File written to: ' + this.getFilePath(filePath))
      }).catch(reject)
    })
  }

  toYAML () {
    return new Promise((resolve, reject) => {
      this.parseMain().then((json) => {
        return resolve(
          YAML.safeDump(
            json,
            this.indentation
          )
        )
      }).catch(reject)
    })
  }
}
