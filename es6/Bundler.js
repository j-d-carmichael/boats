import Template from './Template'
import * as program from 'commander'
import * as YAML from 'js-yaml'
import fs from 'fs-extra'
import path from 'path'

const resolveRefs = require('json-refs').resolveRefs
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
    this.strip_value = program.strip_value || 'paths/'
    this.mainJSON = ''
    this.appendVersion = (program.exclude_version !== true)
    this.input = program.input
    this.validate = (program.validate === 'on')
    this.output = program.output || false
    this.indentation = program.indentation || 2
    this.originalIndentation = program.originalIndentation || 2
    this.variables = program.variables || {}
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
        processContent: async (res, callback) => {
          try {
            res.text = await Template.load(res.text, res.location, this.originalIndentation, this.strip_value, this.variables)
            callback(null, YAML.safeLoad(res.text))
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

  async parseMainRoot () {
    const renderedIndex = await Template.load(fs.readFileSync(this.input).toString(), this.input, this.originalIndentation, this.strip_value, this.variables)
    return YAML.safeLoad(renderedIndex)
  }

  async parseMain () {
    const root = await this.parseMainRoot()
    const pwd = process.cwd()
    process.chdir(path.dirname(this.input))
    const results = await resolveRefs(root, this.parseMainLoaderOptions())
    this.mainJSON = results.resolved
    await this.validator()
    process.chdir(pwd)
    return this.mainJSON
  }

  async validator () {
    if (!this.validate) {
      const SwaggerParser = require('swagger-parser')
      await SwaggerParser.validate(this.cloneObject(this.mainJSON), {})
    }
    return true
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

  async toJsonFile (filePath) {
    this.output = filePath || false
    await this.toJSON()
    const jsonString = JSON.stringify(this.mainJSON, null, this.indentation)
    if (!this.output) {
      console.log(jsonString)
      return true
    }
    this.writeFile(filePath, jsonString)
    console.log('File written to: ' + this.getFilePath(filePath))
    return jsonString
  }

  async toJSON () {
    return await this.parseMain()
  }

  async toYamlFile (filePath) {
    this.output = filePath || false
    const yml = await this.toYAML()
    if (!this.output) {
      console.log(yml)
      return true
    }
    this.writeFile(filePath, yml)
    console.log('File written to: ' + this.getFilePath(filePath))
    return true
  }

  async toYAML () {
    const json = await this.parseMain()
    return YAML.safeDump(
      json,
      this.indentation
    )
  }
}
