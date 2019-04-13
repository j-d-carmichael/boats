import Template from './Template'
import * as YAML from 'js-yaml'
import fs from 'fs-extra'
import path from 'path'
import getFilePath from './getOutputName'
import validate from './validate'
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
    if (!this.validate) {
      await validate(this.mainJSON)
    }
    process.chdir(pwd)
    return this.mainJSON
  }

  lastChar (string) {
    return string[string.length - 1]
  }

  removeLastChar (str) {
    return str.slice(0, -1)
  }

  writeFile (filePath, contents) {
    try {
      fs.ensureDirSync(path.dirname(filePath))
      const adaptedFilePath = getFilePath(filePath, this.mainJSON, this.appendVersion)
      fs.writeFileSync(adaptedFilePath, contents)
      return adaptedFilePath
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
    console.log('File written to: ' + this.writeFile(filePath, jsonString))
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
    console.log('File written to: ' + this.writeFile(filePath, yml))
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
