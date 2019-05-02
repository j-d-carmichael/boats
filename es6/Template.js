import path from 'path'
import * as nunjucks from 'nunjucks'
import walker from 'walker'
import fs from 'fs-extra'
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
   * @param helpFunctionPaths Array of fully qualified local file paths to nunjucks helper functions
   * @param boatsrc
   */
  directoryParse (
    inputFile
    , output
    , originalIndent = defaults.DEFAULT_ORIGINAL_INDENTATION
    , stripValue = defaults.DEFAULT_STRIP_VALUE
    , variables = {}
    , helpFunctionPaths
    , boatsrc
  ) {
    return new Promise((resolve, reject) => {
      if (!inputFile || !output) {
        throw new Error('You must pass an input file and output directory when parsing multiple files.')
      }
      inputFile = this.cleanInputString(inputFile)
      let returnFileinput
      walker(path.dirname(inputFile))
        .on('file', async (file) => {
          const outputFile = this.calculateOutputFile(inputFile, file, path.dirname(output))
          const rendered = await this.load(fs.readFileSync(file, 'utf8'), file, originalIndent, stripValue, variables, helpFunctionPaths, boatsrc)
          if (inputFile === file) {
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

  /**
   * Cleans the input string to ensure a match with the walker package when mirroring
   * @param relativeFilePath
   * @returns {string|*}
   */
  cleanInputString (relativeFilePath) {
    if (relativeFilePath.substring(0, 2) === './') {
      return relativeFilePath.substring(2, relativeFilePath.length)
    }
    if (relativeFilePath.substring(0, 1) === '/') {
      return relativeFilePath.substring(1, relativeFilePath.length)
    }
    return relativeFilePath
  }

  /**
   * Calculates the output file based on the input file, used for mirroring the input src dir
   * @param inputFile
   * @param currentFile
   * @param outputDirectory
   * @returns {*}
   */
  calculateOutputFile (inputFile, currentFile, outputDirectory) {
    const inputDir = path.dirname(inputFile)
    return path.join(process.cwd(), outputDirectory, currentFile.replace(inputDir, ''))
  }

  /**
   * Loads and renders a tpl file
   * @param inputString The string to parse
   * @param fileLocation The file location the string derived from
   * @param originalIndentation The original indentation
   * @param stripValue The opid strip value
   * @param customVars Custom variables passed to nunjucks
   * @param helpFunctionPaths
   * @param boatsrc Fully qualified path to .boatsrc file
   * @returns {Promise<*>}
   */
  async load (inputString, fileLocation, originalIndentation = 2, stripValue, customVars = {}, helpFunctionPaths = [], boatsrc) {
    this.currentFilePointer = fileLocation
    this.originalIndentation = originalIndentation
    this.stripValue = stripValue
    this.mixinVarNamePrefix = defaults.DEFAULT_MIXIN_VAR_PREFIX
    this.mixinObject = this.setMixinPositions(inputString, originalIndentation)
    this.mixinNumber = 0
    this.setMixinPositions(inputString, originalIndentation)
    this.nunjucksSetup(customVars, helpFunctionPaths, boatsrc)
    try {
      return nunjucks.render(fileLocation)
    } catch (e) {
      console.error('Error parsing nunjucks file ' + fileLocation + ': ')
      console.error(e)
      process.exit(0)
    }
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

  /**
   * Tries to inject the provided json from a .boatsrc file
   * @param boatsrc
   * @returns {{autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string, commentEnd: string, blockEnd: string}}|({autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string, commentEnd: string, blockEnd: string}} & Template.nunjucksOptions)}
   */
  nunjucksOptions (boatsrc = '') {
    let baseOptions = {
      autoescape: false,
      tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '{#',
        commentEnd: '#}'
      }
    }
    try {
      let json = fs.readJsonSync(boatsrc)
      if (json.nunjucksOptions) {
        return Object.assign(baseOptions, json.nunjucksOptions)
      }
    } catch (e) {
      return baseOptions
    }
  }

  /**
   * Sets up the tpl engine for the current file being rendered
   * @param customVars
   * @param helpFunctionPaths
   * @param boatsrc Exact path to a .boatsrc file
   */
  nunjucksSetup (customVars = [], helpFunctionPaths = [], boatsrc = '') {
    let env = nunjucks.configure(this.nunjucksOptions(boatsrc))
    env.addGlobal('mixin', require('../nunjucksHelpers/mixin'))
    env.addGlobal('mixinNumber', this.mixinNumber)
    env.addGlobal('mixinObject', this.mixinObject)
    env.addGlobal('mixinVarNamePrefix', this.mixinVarNamePrefix)

    env.addGlobal('packageJson', require('../nunjucksHelpers/packageJson'))

    env.addGlobal('uniqueOpId', require('../nunjucksHelpers/uniqueOpId'))
    env.addGlobal('uniqueOpIdStripValue', this.stripValue)
    env.addGlobal('currentFilePointer', this.currentFilePointer)

    const processEnvVars = cloneObject(process.env)
    for (let key in processEnvVars) {
      env.addGlobal(key, processEnvVars[key])
    }
    if (Array.isArray(customVars)) {
      customVars.forEach((varObj) => {
        const keys = Object.keys(varObj)
        env.addGlobal(keys[0], varObj[keys[0]])
      })
    }
    helpFunctionPaths.forEach((filePath) => {
      env.addGlobal(
        this.getHelperFunctionNameFromPath(filePath),
        require(filePath)
      )
    })
  }

  /**
   * Returns an alpha numeric underscore helper function name
   * @param filePath
   */
  getHelperFunctionNameFromPath (filePath) {
    return path.basename(filePath, path.extname(filePath)).replace(/[^0-9a-z_]/gi, '')
  }
}

export default new Template()
