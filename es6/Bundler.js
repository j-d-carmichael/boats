import mixin from './mixin'
import calculateIndentFromLineBreak from './calculateIndentFromLineBreak'
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
    this.cleanLeaf = program.clean_leaf || false
    this.validateOff = program.validate_off || false
    this.destination = program.destination || false
    this.indentation = program.indentation || 4
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
          let mixinRegex = /'?(mixin\(.*\))'?/
          let mixinStr = res.text.match(mixinRegex)
          if (mixinStr) {
            let indent = calculateIndentFromLineBreak(res.text, mixinStr.index) + this.originalIndentation
            let replaceVal = `
`
            let linePadding = ''
            for (let i = 0; i < indent; ++i) {
              linePadding += ' '
            }
            replaceVal += mixin(mixinStr[0], res.location, linePadding)
            res.text = res.text.replace(
              mixinStr[0],
              replaceVal
            )
          }

          try {
            const content = YAML.safeLoad(res.text)
            callback(null, content)
          } catch (e) {
            console.error('Error parsing')
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
        this.validate()
          .then(() => {
            process.chdir(pwd)
            return resolve(this.mainJSON)
          })
          .catch(dd)
      })
        .catch(dd)
    })
  }

  validate () {
    return new Promise((resolve, reject) => {
      if (!this.validateOff) {
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
        // try and get the version from the yml file
        return dd('No version provided and no version in the package.json')
      }
    }
    return '_' + swagVersion
  }

  getFileName (name, ext) {
    return name + this.getVersion() + '.' + ext
  }

  writeFile (dir, name, ext, contents) {
    try {
      fs.ensureDirSync(dir)
      return fs.writeFileSync(path.join(dir, this.getFileName(name, ext)), contents)
    } catch (e) {
      dd({
        msg: 'Error writing file',
        e: e
      })
    }
  }

  toJsonFile (dir, name, ext) {
    this.destination = dir || false
    ext = ext || 'json'
    return new Promise((resolve, reject) => {
      this.toJSON().then((json) => {
        if (!this.destination) {
          console.log(JSON.stringify(this.mainJSON, null, 4))
          return resolve()
        }
        this.writeFile(dir, name, ext, JSON.stringify(json, null, this.indentation))
        resolve('File written to: ' + path.join(dir, this.getFileName(name, ext)))
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

  toYamlFile (dir, name, ext) {
    ext = ext || 'yaml'
    this.destination = dir || false
    return new Promise((resolve, reject) => {
      this.toYAML().then((yml) => {
        if (!this.destination) {
          console.log(yml)
          return resolve()
        }
        this.writeFile(dir, name, ext, yml)
        resolve('File written to: ' + path.join(dir, this.getFileName(name, ext)))
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
