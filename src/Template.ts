import upath from 'upath';
import nunjucks from 'nunjucks';
import fs from 'fs-extra';
import calculateIndentFromLineBreak from '@/calculateIndentFromLineBreak';
import cloneObject from '@/cloneObject';
import defaults from '@/defaults';
import stripFromEndOfString from '@/stripFromEndOfString';
import apiTypeFromString from '@/apiTypeFromString';
import Injector from '@/Injector';
import * as _ from 'lodash';
import autoChannelIndexer from '@/nunjucksHelpers/autoChannelIndexer';
import autoComponentIndexer from '@/nunjucksHelpers/autoComponentIndexer';
import autoPathIndexer from '@/nunjucksHelpers/autoPathIndexer';
import schemaRef from '@/nunjucksHelpers/schemaRef';
import autoTag from '@/nunjucksHelpers/autoTag';
import fileName from '@/nunjucksHelpers/fileName';
import inject from '@/nunjucksHelpers/inject';
import merge from '@/nunjucksHelpers/merge';
import mixin from '@/nunjucksHelpers/mixin';
import packageJson from '@/nunjucksHelpers/packageJson';
import routePermission from '@/nunjucksHelpers/routePermission';
import uniqueOpId from '@/nunjucksHelpers/uniqueOpId';
import optionalProps from './nunjucksHelpers/optionalProps';
import pickProps from './nunjucksHelpers/pickProps';
import { BoatsRC } from '@/interfaces/BoatsRc';
import { PathInjector } from './pathInjector';

// No types found for walker
// eslint-disable-next-line @typescript-eslint/no-var-requires
const walker = require('walker');

class Template {
  originalIndentation: number;
  mixinVarNamePrefix: string;
  helpFunctionPaths: string[];
  variables: any[];
  boatsrc: any;
  inputFile: string;
  stripValue: string;
  currentFilePointer: string;
  mixinObject: any[];
  mixinNumber: number;
  indentObject: any[];
  indentNumber: number;

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
    boatsrc: BoatsRC
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!inputFile || !output) {
        throw new Error('You must pass an input file and output directory when parsing multiple files.');
      }
      this.originalIndentation = originalIndent;
      this.mixinVarNamePrefix = defaults.DEFAULT_MIXIN_VAR_PREFIX;
      this.helpFunctionPaths = helpFunctionPaths || [];
      this.variables = variables || [];
      this.boatsrc = boatsrc;
      this.inputFile = inputFile = this.cleanInputString(inputFile);

      // ensure we parse the input file 1st as this typically contains the inject function
      // this will also allow us to determine the api type and correctly set the stripValue
      const renderedIndex = this.renderFile(fs.readFileSync(inputFile, 'utf8'), inputFile);
      this.stripValue = this.setDefaultStripValue(stripValue, renderedIndex);

      let returnFileinput: string;
      walker(upath.dirname(inputFile))
        .on('file', (file: string) => {
          try {
            file = upath.toUnix(file);
            const outputFile = this.calculateOutputFile(inputFile, file, upath.dirname(output));
            const rendered = this.renderFile(fs.readFileSync(file, 'utf8'), file);
            if (upath.normalize(inputFile) === upath.normalize(file)) {
              returnFileinput = outputFile;
            }
            fs.outputFileSync(outputFile, rendered);
          } catch (e) {
            console.error(`Error parsing nunjucks file ${file}: `);
            return reject(e);
          }
        })
        .on('error', (er: any, entry: string) => {
          reject(er + ' on entry ' + entry);
        })
        .on('end', () => {
          resolve(this.stripNjkExtension(returnFileinput));
        });
    });
  }

  setDefaultStripValue (stripValue?: string, inputString?: string): string {
    if (stripValue) {
      return stripValue;
    }
    switch (apiTypeFromString(inputString)) {
      case 'swagger':
        return 'src/paths/';
      case 'openapi':
        return 'src/paths/';
      case 'asyncapi':
        return 'src/channels/';
    }
    throw new Error('Non supported api type provided. BOATS only supports swagger/openapi/asyncapi');
  }

  /**
   * Cleans the input string to ensure a match with the walker package when mirroring
   * @param relativeFilePath
   * @returns {string|*}
   */
  cleanInputString (relativeFilePath: string) {
    relativeFilePath = upath.toUnix(relativeFilePath)

    if (relativeFilePath.substring(0, 2) === './') {
      return relativeFilePath.substring(2, relativeFilePath.length);
    }
    if (relativeFilePath.substring(0, 1) === '/') {
      return relativeFilePath.substring(1, relativeFilePath.length);
    }
    return relativeFilePath;
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
    const inputDir = upath.dirname(inputFile);
    return this.stripNjkExtension(upath.join(process.cwd(), outputDirectory, currentFile.replace(inputDir, '')));
  }

  /**
   * Strips out the njk ext from a given string
   * @param input
   * @return string
   */
  stripNjkExtension (input: string) {
    return stripFromEndOfString(input, '.njk');
  }

  /**
   * After render use only, takes a rendered njk file and replaces the .yml.njk with .njk
   * @param multiLineBlock
   * @returns {*|void|string}
   */
  stripNjkExtensionFrom$Refs (multiLineBlock: string) {
    const pattern = '.yml.njk';
    const regex = new RegExp(pattern, 'g');
    return multiLineBlock.replace(regex, '.yml');
  }

  /**
   * Loads and renders a tpl file
   * @param inputString The string to parse
   * @param fileLocation The file location the string derived from
   */
  renderFile (inputString: string, fileLocation: string) {
    this.currentFilePointer = upath.toUnix(fileLocation);
    this.mixinObject = this.setMixinPositions(inputString, this.originalIndentation);
    this.mixinNumber = 0;
    this.indentObject = this.setIndentPositions(inputString, 0);
    this.indentNumber = 0;
    this.nunjucksSetup();

    const renderedYaml = Injector.injectAndRender(fileLocation, this.inputFile, this.boatsrc);

    return this.stripNjkExtensionFrom$Refs(renderedYaml);
  }

  /**
   *
   * @param str The string to look for mixins
   * @param originalIndentation The original indentation setting, defaults to 2
   * @returns {Array}
   */
  setMixinPositions (str: string, originalIndentation = 2): any[] {
    const regexp = RegExp(/(mixin\(["'`]([^"`']*)["'`].*\))/, 'g');
    let matches;
    const matched: any[] = [];
    while ((matches = regexp.exec(str)) !== null) {
      const mixinObj = {
        index: regexp.lastIndex,
        match: matches[0],
        mixinPath: matches[2],
        mixinLinePadding: ''
      };
      const indent = calculateIndentFromLineBreak(str, mixinObj.index) + originalIndentation;
      for (let i = 0; i < indent; ++i) {
        mixinObj.mixinLinePadding += ' ';
      }
      matched.push(mixinObj);
    }
    return matched;
  }

  /**
   *
   * @param str The string to look for helpers that need indentations
   * @param originalIndentation The original indentation setting, defaults to 2
   * @returns {Array}
   */
  setIndentPositions (str: string, originalIndentation = 0): any[] {
    const regexp = RegExp(/((optionalProps|pickProps)\(.*\))/, 'g');
    let matches;
    const matched: any[] = [];
    const preparedString = str
      .split('\n')
      .map((s) => (/^\s*\-/.test(s) ? s.replace('-', ' ') : s))
      .join('\n');

    while ((matches = regexp.exec(preparedString)) !== null) {
      const indentObject = {
        index: regexp.lastIndex,
        match: matches[0],
        linePadding: ''
      };
      const indent = calculateIndentFromLineBreak(preparedString, indentObject.index) + originalIndentation;
      for (let i = 0; i < indent; ++i) {
        indentObject.linePadding += ' ';
      }
      matched.push(indentObject);
    }
    return matched;
  }

  /**
   * Sets up the tpl engine for the current file being rendered
   */
  // eslint-disable-next-line max-lines-per-function
  nunjucksSetup () {
    const env = nunjucks.configure(this.boatsrc.nunjucksOptions);
    const processEnvVars = cloneObject(process.env);
    for (const key in processEnvVars) {
      env.addGlobal(key, processEnvVars[key]);
    }
    if (Array.isArray(this.variables)) {
      this.variables.forEach((varObj) => {
        const keys = Object.keys(varObj);
        env.addGlobal(keys[0], varObj[keys[0]]);
      });
    }
    env.addGlobal('boatsConfig', this.boatsrc);
    env.addGlobal('pathInjector', new PathInjector(this.boatsrc.paths, upath.relative('.', upath.dirname(this.inputFile))));
    env.addGlobal('mixinNumber', this.mixinNumber);
    env.addGlobal('mixinObject', this.mixinObject);
    env.addGlobal('indentNumber', this.indentNumber);
    env.addGlobal('indentObject', this.indentObject);
    env.addGlobal('mixinVarNamePrefix', this.mixinVarNamePrefix);
    env.addGlobal('currentFilePointer', this.currentFilePointer);
    env.addGlobal('uniqueOpIdStripValue', this.stripValue);
    env.addGlobal('autoChannelIndexer', autoChannelIndexer);
    env.addGlobal('autoComponentIndexer', autoComponentIndexer);
    env.addGlobal('autoPathIndexer', autoPathIndexer);
    env.addGlobal('schemaRef', schemaRef);
    env.addGlobal('autoTag', autoTag);
    env.addGlobal('fileName', fileName);
    env.addGlobal('inject', inject);
    env.addGlobal('optionalProps', optionalProps);
    env.addGlobal('pickProps', pickProps);
    env.addGlobal('merge', merge);
    env.addGlobal('mixin', mixin);
    env.addGlobal('packageJson', packageJson);
    env.addGlobal('routePermission', routePermission);
    env.addGlobal('uniqueOpId', uniqueOpId);
    env.addGlobal('_', _);

    // Lastly, inject the helper files, this will of course override any existing helpers
    // already injected, which could be good thing if you know what you are doing.
    for (let i = 0; i < this.helpFunctionPaths.length; ++i) {
      const filePath = this.helpFunctionPaths[i];

      if (filePath.endsWith('.ts')) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('ts-node').register();
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let helper = require(filePath);
      if (typeof helper !== 'function' && typeof helper.default === 'function') {
        helper = helper.default;
      }

      const helperType = helper(nunjucks);
      if (typeof helperType === 'function') {
        helper = helperType;
      }
      env.addGlobal(this.getHelperFunctionNameFromPath(filePath), helper);
    }
  }

  /**
   * Returns an alpha numeric underscore helper function name
   * @param filePath
   */
  getHelperFunctionNameFromPath (filePath: string) {
    return upath.basename(filePath, upath.extname(filePath)).replace(/[^0-9a-z_]/gi, '');
  }
}

export default new Template();
