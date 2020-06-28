import path from 'path'
import nunjucks from 'nunjucks'
import fs from 'fs-extra'
import calculateIndentFromLineBreak from '@/calculateIndentFromLineBreak'
import cloneObject from '@/cloneObject'
import defaults from '@/defaults'
import stripFromEndOfString from '@/stripFromEndOfString'
import apiTypeFromString from '@/apiTypeFromString'
import Injector from '@/Injector'

import autoChannelIndexer from '@/nunjucksHelpers/autoChannelIndexer'
import autoComponentIndexer from '@/nunjucksHelpers/autoComponentIndexer'
import autoPathIndexer from '@/nunjucksHelpers/autoPathIndexer'
import autoTag from '@/nunjucksHelpers/autoTag'
import fileName from '@/nunjucksHelpers/fileName'
import inject from '@/nunjucksHelpers/inject'
import mixin from '@/nunjucksHelpers/mixin'
import packageJson from '@/nunjucksHelpers/packageJson'
import routePermission from '@/nunjucksHelpers/routePermission'
import uniqueOpId from '@/nunjucksHelpers/uniqueOpId'

// No types found for walker
// eslint-disable-next-line @typescript-eslint/no-var-requires
const walker = require('walker')

class Template {
  originalIndentation: number
  mixinVarNamePrefix: string
  helpFunctionPaths: string[]
  variables: any[]
  boatsrc: any
  inputFile: string
  stripValue: string
  currentFilePointer: string
  mixinObject: any[]
  mixinNumber: number

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
    inputFile: string,
    output: string,
    originalIndent = defaults.DEFAULT_ORIGINAL_INDENTATION,
    stripValue = defaults.DEFAULT_STRIP_VALUE,
    variables: any[],
    helpFunctionPaths: string[],
    boatsrc: any
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!inputFile || !output) {
        throw new Error('You must pass an input file and output directory when parsing multiple files.')
      }
      this.originalIndentation = originalIndent
      this.mixinVarNamePrefix = defaults.DEFAULT_MIXIN_VAR_PREFIX
      this.helpFunctionPaths = helpFunctionPaths || []
      this.variables = variables || []
      this.boatsrc = this.getBoatsConfig(boatsrc)
      this.inputFile = inputFile = this.cleanInputString(inputFile)

      // ensure we parse the input file 1st as this typically contains the inject function
      // this will also allow us to determine the api type and correctly set the stripValue
      const renderedIndex = this.renderFile(fs.readFileSync(inputFile, 'utf8'), inputFile)
      this.stripValue = this.setDefaultStripValue(stripValue, renderedIndex)

      let returnFileinput: string
      walker(path.dirname(inputFile))
        .on('file', (file: string) => {
          try {
            const outputFile = this.calculateOutputFile(inputFile, file, path.dirname(output))
            const rendered = this.renderFile(fs.readFileSync(file, 'utf8'), file)
            if (path.normalize(inputFile) === path.normalize(file)) {
              returnFileinput = outputFile
            }
            fs.outputFileSync(outputFile, rendered)
          } catch (e) {
            console.error(`Error parsing nunjucks file ${file}: `)
            return reject(e)
          }
        })
        .on('error', (er: any, entry: string) => {
          reject(er + ' on entry ' + entry)
        })
        .on('end', () => {
          resolve(this.stripNjkExtension(returnFileinput))
        })
    })
  }

  setDefaultStripValue (stripValue?: string, inputString?: string): string {
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
  cleanInputString (relativeFilePath: string) {
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
  calculateOutputFile (inputFile: string, currentFile: string, outputDirectory: string) {
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
  stripNjkExtension (input: string) {
    return stripFromEndOfString(input, '.njk')
  }

  /**
   * After render use only, takes a rendered njk file and replaces the .yml.njk with .njk
   * @param multiLineBlock
   * @returns {*|void|string}
   */
  stripNjkExtensionFrom$Refs (multiLineBlock: string) {
    const pattern = '.yml.njk'
    const regex = new RegExp(pattern, 'g')
    return multiLineBlock.replace(regex, '.yml')
  }

  /**
   * Loads and renders a tpl file
   * @param inputString The string to parse
   * @param fileLocation The file location the string derived from
   */
  renderFile (inputString: string, fileLocation: string) {
    this.currentFilePointer = fileLocation
    this.mixinObject = this.setMixinPositions(inputString, this.originalIndentation)
    this.mixinNumber = 0
    this.nunjucksSetup()

    const renderedYaml = Injector.injectAndRender(fileLocation, this.inputFile)

    return this.stripNjkExtensionFrom$Refs(renderedYaml)
  }

  /**
   *
   * @param str The string to look for mixins
   * @param originalIndentation The original indentation setting, defaults to 2
   * @returns {Array}
   */
  setMixinPositions (str: string, originalIndentation = 2): any[] {
    const regexp = RegExp(/(mixin\(.*\))/, 'g')
    let matches
    const matched: any[] = []
    while ((matches = regexp.exec(str)) !== null) {
      const mixinObj = {
        index: regexp.lastIndex,
        match: matches[0],
        mixinLinePadding: '',
      }
      const indent = calculateIndentFromLineBreak(str, mixinObj.index) + originalIndentation
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
  getBoatsConfig (boatsrc = '') {
    const baseOptions = {
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
      const json = fs.readJsonSync(boatsrc)
      if (json.nunjucksOptions) {
        json.nunjucksOptions = Object.assign(baseOptions, json.nunjucksOptions)
      }
      return json
    } catch (e) {
      return {}
    }
  }

  /**
   * Sets up the tpl engine for the current file being rendered
   * @param customVars
   * @param helpFunctionPaths
   * @param boatsrc Exact path to a .boatsrc file
   */
  nunjucksSetup () {
    const env = nunjucks.configure(this.boatsrc.nunjucksOptions)
    env.addGlobal('boatsConfig', this.boatsrc)
    env.addGlobal('mixinNumber', this.mixinNumber)
    env.addGlobal('mixinObject', this.mixinObject)
    env.addGlobal('mixinVarNamePrefix', this.mixinVarNamePrefix)
    env.addGlobal('currentFilePointer', this.currentFilePointer)
    env.addGlobal('uniqueOpIdStripValue', this.stripValue)

    // helpers
    env.addGlobal('autoChannelIndexer', autoChannelIndexer)
    env.addGlobal('autoComponentIndexer', autoComponentIndexer)
    env.addGlobal('autoPathIndexer', autoPathIndexer)
    env.addGlobal('autoTag', autoTag)
    env.addGlobal('fileName', fileName)
    env.addGlobal('inject', inject)
    env.addGlobal('mixin', mixin)
    env.addGlobal('packageJson', packageJson)
    env.addGlobal('routePermission', routePermission)
    env.addGlobal('uniqueOpId', uniqueOpId)

    const processEnvVars = cloneObject(process.env)
    for (const key in processEnvVars) {
      env.addGlobal(key, processEnvVars[key])
    }
    if (Array.isArray(this.variables)) {
      this.variables.forEach((varObj) => {
        const keys = Object.keys(varObj)
        env.addGlobal(keys[0], varObj[keys[0]])
      })
    }
    this.helpFunctionPaths.forEach((filePath) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      env.addGlobal(this.getHelperFunctionNameFromPath(filePath), require(filePath))
    })
  }

  /**
   * Returns an alpha numeric underscore helper function name
   * @param filePath
   */
  getHelperFunctionNameFromPath (filePath: string) {
    return path.basename(filePath, path.extname(filePath)).replace(/[^0-9a-z_]/gi, '')
  }
}

export default new Template()
