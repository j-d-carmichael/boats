const path = require('path')
const nunjucks = require('nunjucks')
const walker = require('walker')
const fs = require('fs-extra')
const calculateIndentFromLineBreak = require('./calculateIndentFromLineBreak')
const cloneObject = require('./cloneObject')
const defaults = require('./defaults')
const stripFromEnd = require('./stripFromEndOfString')
const apiTypeFromString = require('./apiTypeFromString')
const Injector = require('./Injector')

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
    inputFile,
    output,
    originalIndent = defaults.DEFAULT_ORIGINAL_INDENTATION,
    stripValue = defaults.DEFAULT_STRIP_VALUE,
    variables,
    helpFunctionPaths,
    boatsrc
  ) {
    return new Promise((resolve, reject) => {
      if (!inputFile || !output) {
        throw new Error(
          'You must pass an input file and output directory when parsing multiple files.'
        )
      }

      this.originalIndentation = originalIndent
      this.mixinVarNamePrefix = defaults.DEFAULT_MIXIN_VAR_PREFIX
      this.helpFunctionPaths = helpFunctionPaths || []
      this.variables = variables || {}
      this.boatsrc = boatsrc || ''

      inputFile = this.cleanInputString(inputFile)
      this.inputFile = inputFile

      // ensure we parse the input file 1st as this typically contains the inject function
      // this will also allow us to determine the api type and correctly set the stripValue
      const renderedIndex = this.renderFile(fs.readFileSync(inputFile, 'utf8'), inputFile)
      this.stripValue = this.setDefaultStripValue(stripValue, renderedIndex)

      let returnFileinput
      walker(path.dirname(inputFile))
        .on('file', (file) => {
          try {
            const outputFile = this.calculateOutputFile(inputFile, file, path.dirname(output))
            const rendered = this.renderFile(fs.readFileSync(file, 'utf8'), file)
            if (path.normalize(inputFile) === path.normalize(file)) {
              returnFileinput = outputFile
            }
            fs.outputFileSync(outputFile, rendered)
          } catch (e) {
            reject(e)
          }
        })
        .on('error', (er, entry) => {
          reject(er + ' on entry ' + entry)
        })
        .on('end', () => {
          resolve(this.stripNjkExtension(returnFileinput))
        })
    })
  }

  setDefaultStripValue (stripValue, inputString) {
    if (stripValue) {
      return stripValue
    }
    switch (apiTypeFromString(inputString)) {
      case 'swagger':
        return 'src/paths/'
      case 'openapi':
        return 'src/paths/'
      case 'asyncapi':
        return 'src/channels/'
    }
    throw new Error('Non supported api type provided. BOATS only supports swagger/openapi/asyncapi')
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
   * Calculates the output file based on the input file, used for mirroring the input src dir.
   * Any .njk ext will automatically be removed.
   * @param inputFile
   * @param currentFile
   * @param outputDirectory
   * @returns {*}
   */
  calculateOutputFile (inputFile, currentFile, outputDirectory) {
    const inputDir = path.dirname(inputFile)
    return this.stripNjkExtension(
      path.join(process.cwd(), outputDirectory, currentFile.replace(inputDir, ''))
    )
  }

  /**
   * Strips out the njk ext from a given string
   * @param input
   * @return string
   */
  stripNjkExtension (input) {
    return stripFromEnd(input, '.njk')
  }

  /**
   * After render use only, takes a rendered njk file and replaces the .yml.njk with .njk
   * @param multiLineBlock
   * @returns {*|void|string}
   */
  stripNjkExtensionFrom$Refs (multiLineBlock) {
    const pattern = '.yml.njk'
    const regex = new RegExp(pattern, 'g')
    return multiLineBlock.replace(regex, '.yml')
  }

  /**
   * Loads and renders a tpl file
   * @param inputString The string to parse
   * @param fileLocation The file location the string derived from
   */
  renderFile (inputString, fileLocation) {
    this.currentFilePointer = fileLocation
    this.mixinObject = this.setMixinPositions(inputString, this.originalIndentation)
    this.mixinNumber = 0
    this.nunjucksSetup()

    try {
      let renderedYaml = Injector.injectAndRender(fileLocation, this.inputFile)

      return this.stripNjkExtensionFrom$Refs(renderedYaml)
    } catch (e) {
      console.error(`Error parsing nunjucks file ${fileLocation}: `)
      throw e
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
        mixinLinePadding: '',
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
        commentEnd: '#}',
      },
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
  nunjucksSetup () {
    let env = nunjucks.configure(this.nunjucksOptions(this.boatsrc))
    env.addGlobal('mixin', require('../nunjucksHelpers/mixin'))
    env.addGlobal('mixinNumber', this.mixinNumber)
    env.addGlobal('mixinObject', this.mixinObject)
    env.addGlobal('mixinVarNamePrefix', this.mixinVarNamePrefix)

    env.addGlobal('packageJson', require('../nunjucksHelpers/packageJson'))

    env.addGlobal('autoPathIndexer', require('../nunjucksHelpers/autoPathIndexer'))
    env.addGlobal('autoChannelIndexer', require('../nunjucksHelpers/autoChannelIndexer'))
    env.addGlobal('autoComponentIndexer', require('../nunjucksHelpers/autoComponentIndexer'))
    env.addGlobal('autoTag', require('../nunjucksHelpers/autoTag'))
    env.addGlobal('currentFilePointer', this.currentFilePointer)
    env.addGlobal('inject', require('../nunjucksHelpers/inject'))
    env.addGlobal('fileName', require('../nunjucksHelpers/fileName'))
    env.addGlobal('uniqueOpId', require('../nunjucksHelpers/uniqueOpId'))
    env.addGlobal('uniqueOpIdStripValue', this.stripValue)

    const processEnvVars = cloneObject(process.env)
    for (let key in processEnvVars) {
      env.addGlobal(key, processEnvVars[key])
    }
    if (Array.isArray(this.customVars)) {
      this.customVars.forEach((varObj) => {
        const keys = Object.keys(varObj)
        env.addGlobal(keys[0], varObj[keys[0]])
      })
    }
    this.helpFunctionPaths.forEach((filePath) => {
      env.addGlobal(this.getHelperFunctionNameFromPath(filePath), require(filePath))
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

module.exports = new Template()
