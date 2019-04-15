import path from 'path'
import * as nunjucks from 'nunjucks'
import walker from 'walker'
import fs from 'fs-extra'
import UniqueOperationIds from './UniqueOperationIds'
import calculateIndentFromLineBreak from './calculateIndentFromLineBreak'
import cloneObject from './cloneObject'
import * as defaults from './defaults'

class Template {
  /**
   * Parses all files in a folder against the nunjuck tpl engine and outputs in a mirrored path the in provided outputDirectory
   * @param inputFile The input directory to start parsing from
   * @param output The directory to output/mirror to
   * @param originalIndent The original indent (currently hard coded to 2)
   * @param stripValue The strip value for the uniqueOpIp
   * @param variables The variables for the tpl engine
   */
  directoryParse (inputFile, output, originalIndent = defaults.DEFAULT_ORIGINAL_INDENTATION, stripValue = defaults.DEFAULT_STRIP_VALUE, variables = {}) {
    return new Promise((resolve, reject) => {
      if (!inputFile || !output) {
        throw new Error('You must pass an input file and output directory when parsing multiple files.')
      }
      inputFile = this.cleanInputString(inputFile)

      let returnFileinput
      walker(path.dirname(inputFile))
        .on('file', async (file) => {
          const outputFile = this.calculateOutputFile(inputFile, file, path.dirname(output))
          const rendered = await this.load(fs.readFileSync(file, 'utf8'), file, originalIndent, stripValue, variables)
          if(inputFile === file){
            returnFileinput = outputFile
          }
          fs.outputFileSync(outputFile, rendered)
        })
        .on('error', (er, entry) => {
          reject(er + ' on entry ' + entry)
        })
        .on('end', () => {
          resolve(returnFileinput)
        })
    })
  }

  cleanInputString(relativeFilePath){
    if(relativeFilePath.substring(0, 2) === './'){
      return relativeFilePath.substring(2, relativeFilePath.length)
    }
    if(relativeFilePath.substring(0, 1) === '/'){
      return relativeFilePath.substring(1, relativeFilePath.length)
    }
    return relativeFilePath
  }

  calculateOutputFile (inputFile, currentFile, outputDirectory) {
    const inputDir = path.dirname(inputFile)
    return path.join(process.cwd(), outputDirectory, currentFile.replace(inputDir, ''))
  }

  /**
   *
   * @param inputString The string to parse
   * @param fileLocation The file location the string derived from
   * @param originalIndentation The original indentation
   * @param stripValue The opid strip value
   * @param customVars Custom variables passed to nunjucks
   * @returns {Promise<*>}
   */
  async load (inputString, fileLocation, originalIndentation = 2, stripValue, customVars = {}) {
    this.currentFilePointer = fileLocation
    this.originalIndentation = originalIndentation
    this.stripValue = stripValue
    this.mixinVarNamePrefix = defaults.DEFAULT_MIXIN_VAR_PREFIX
    this.mixinObject = this.setMixinPositions(inputString, originalIndentation)
    this.mixinNumber = 0
    this.setMixinPositions(inputString, originalIndentation)
    this.nunjucksSetup(customVars)
    return nunjucks.render(fileLocation)
  }

  /**
   *
   * @param str The string to look for mixins
   * @param originalIndentation The original indentation setting, defaults to 2
   * @returns {Array}
   */
  setMixinPositions (str, originalIndentation) {
    const regexp = RegExp(/(mixin\(.*\))/, 'g')
    let matches
    let matched = []
    while ((matches = regexp.exec(str)) !== null) {
      let mixinObj = {
        index: regexp.lastIndex,
        match: matches[0],
        mixinLinePadding: ''
      }
      let indent = calculateIndentFromLineBreak(str, mixinObj.index) + originalIndentation
      for (let i = 0; i < indent; ++i) {
        mixinObj.mixinLinePadding += ' '
      }
      matched.push(mixinObj)
    }
    return matched
  }

  nunjucksSetup (customVars) {
    let env = nunjucks.configure({ autoescape: false })
    env.addGlobal('mixin', this.mixin)
    env.addGlobal('mixinNumber', this.mixinNumber)
    env.addGlobal('mixinObject', this.mixinObject)
    env.addGlobal('mixinVarNamePrefix', this.mixinVarNamePrefix)
    env.addGlobal('uniqueOpId', this.uniqueOpId)
    env.addGlobal('uniqueOpIdStripValue', this.stripValue)
    env.addGlobal('currentFilePointer', this.currentFilePointer)
    const processEnvVars = cloneObject(process.env)
    for (let key in processEnvVars) {
      env.addGlobal(key, processEnvVars[key])
    }

    for (let key in customVars) {
      env.addGlobal(key, customVars[key])
    }
  }

  uniqueOpId () {
    return UniqueOperationIds.getUniqueOperationIdFromPath(this.env.globals.currentFilePointer, this.env.globals.uniqueOpIdStripValue)
  }

  mixin () {
    let tplGlobals = this.env.globals
    const renderPath = path.join(path.dirname(tplGlobals.currentFilePointer), arguments[0])
    if (!fs.pathExistsSync(renderPath)) {
      throw new Error('Path not found when trying to render mixin: ' + renderPath)
    }
    let vars = {}
    for (let i = 1; i < arguments.length; ++i) {
      vars[tplGlobals.mixinVarNamePrefix + i] = arguments[i]
    }
    let replaceVal = `
`
    let rendered = nunjucks.render(renderPath, vars)
    // inject the indentation
    let parts = rendered.split('\n')
    parts.forEach((part, i) => {
      parts[i] = tplGlobals.mixinObject[tplGlobals.mixinNumber].mixinLinePadding + part
    })
    ++this.env.globals.mixinNumber
    return replaceVal + parts.join('\n')
  }
}

export default new Template()
