import upath from 'upath';
import deepmerge from 'deepmerge';
import jsYaml from 'js-yaml';
import picomatch from 'picomatch';
import { render, renderString } from 'nunjucks';
import { BoatsRC } from '@/interfaces/BoatsRc';

class Injector {
  fileToRouteMap: any;

  constructor () {
    this.fileToRouteMap = {};
  }

  /**
   * Render the base template and inject content if provided
   */
  injectAndRender (inputPath: string, inputIndexYaml: string, boatsRc: BoatsRC): string {
    const fullPath = upath.join(upath.toUnix(process.cwd()), inputPath);
    const relativePathToRoot = upath.relative(upath.dirname(inputPath), upath.dirname(inputIndexYaml));
    const picomatchOptions = boatsRc.picomatchOptions || { bash: true };
    const yaml = this.convertRootRefToRelative(render(fullPath), relativePathToRoot);

    if (!global.boatsInject) {
      return yaml;
    }

    if (!/\/(paths|channels)\//.test(inputPath)) {
      return yaml;
    }

    if (/index\./.test(upath.basename(inputPath))) {
      this.mapIndex(yaml, inputPath);
      return yaml;
    }

    let jsonTemplate = jsYaml.safeLoad(yaml);

    for (const { toAllOperations } of global.boatsInject) {
      if (this.shouldInject(toAllOperations, inputPath, picomatchOptions)) {
        jsonTemplate = this.mergeInjection(jsonTemplate, relativePathToRoot, toAllOperations.content);
      }
    }

    return jsYaml.safeDump(jsonTemplate);
  }

  /**
   * Merge the JSON from the YAML with the JSON injection content
   *
   * @param  {object}  jsonTemplate        JSON representation of the YAML file
   * @param  {string}  relativePathToRoot  Path from current file to root index (../ repeated)
   * @param  {object}  content             Content to be injected
   *
   * @return {object}  Merged JSON of the template
   */
  mergeInjection (jsonTemplate: any, relativePathToRoot: string, content: string | any): any {
    if (!jsonTemplate || !content) {
      return jsonTemplate;
    }

    if (typeof content === 'object') {
      content = JSON.stringify(content);
    }

    content = this.convertRootRefToRelative(content, relativePathToRoot);
    const renderedString = renderString(content, {});

    const injectionContent = jsYaml.safeLoad(renderedString);

    return deepmerge(jsonTemplate, injectionContent);
  }

  buildInjectRuleObject (injection: any): any {
    return {
      exclude: [] /* << deprecated and will be removed in the a future release */,
      excludeChannels: [],
      includeOnlyChannels: [],
      excludePaths: [],
      includeOnlyPaths: [],
      includeMethods: [],
      ...injection
    };
  }

  shouldSkipMethod (injectRule: any, method: string): boolean {
    if (injectRule.includeMethods.length) {
      const methodsRegex = new RegExp(`\\b(${injectRule.includeMethods.join('|')})\\b`, 'i');
      return !methodsRegex.test(method);
    }
    return false;
  }

  /**
   * Checks if the content should be injected
   *
   * @param  {object}   injection  Injection rule
   * @param  {string}   inputPath  Path to target file
   *
   * @param  {object}   picomatchOptions  node_modules/@types/picomatch/index.d.ts  PicomatchOptions  not exported from the types
   * @return {boolean}  True if the path satisfies the rule
   */
  shouldInject (injection: any, inputPath: string, picomatchOptions: any) {
    if (!injection) {
      return false;
    }
    const injectRule = this.buildInjectRuleObject(injection);
    const operationName = this.fileToRouteMap[inputPath];
    const methodName = upath.basename(inputPath).replace(/\..*/, '');

    if (
      /channels/.test(inputPath) &&
      this.shouldInjectToChannels(operationName, injectRule, methodName, picomatchOptions) === false
    ) {
      return false;
    }
    if (
      /paths/.test(inputPath) &&
      this.shouldInjectToPaths(operationName, injectRule, methodName, picomatchOptions) === false
    ) {
      return false;
    }
    return true;
  }

  /**
   * Returns false when the channel should not be injected into
   * else returns true
   */
  shouldInjectToChannels (operationName: string, injectRule: any, methodName: string, picomatchOptions: any) {
    // Exclude channels
    if (this.globCheck(operationName, injectRule.excludeChannels, picomatchOptions, methodName)) {
      return false;
    }
    if (this.globCheck(operationName, injectRule.exclude, picomatchOptions, methodName)) {
      return false;
    }
    // Specifically include a channel
    if (
      injectRule.includeOnlyChannels.length > 0 &&
      !this.globCheck(operationName, injectRule.includeOnlyChannels, picomatchOptions, methodName)
    ) {
      return false;
    }
    // include method
    if (this.shouldSkipMethod(injectRule, methodName)) {
      return false;
    }

    return true;
  }

  /**
   * Returns false when the path should not be injected into
   * else returns true
   */
  shouldInjectToPaths (operationName: string, injectRule: any, methodName: string, picomatchOptions: any) {
    // Exclude a path completely
    if (this.globCheck(operationName, injectRule.excludePaths, picomatchOptions, methodName)) {
      return false;
    }
    // Specifically include a path
    if (
      injectRule.includeOnlyPaths.length > 0 &&
      !this.globCheck(operationName, injectRule.includeOnlyPaths, picomatchOptions, methodName)
    ) {
      return false;
    }
    // include method
    if (this.shouldSkipMethod(injectRule, methodName)) {
      return false;
    }

    return true;
  }

  /**
   * Pico matching the path against the rules in the inject object
   * @param needle
   * @param haystack
   * @param picoOptions node_modules/@types/picomatch/index.d.ts  PicomatchOptions  not exported from the types
   * @param currentMethod
   */
  globCheck (needle: string, haystack: any[], picoOptions: any, currentMethod: string): boolean {
    let resp = false;
    if (typeof needle !== 'string') {
      // catch for tpl not included in a manual index file
      return resp;
    }
    haystack.forEach((hay: any) => {
      let stringToCheck;
      let methodsToCheck: string[];
      if (typeof hay === 'string') {
        stringToCheck = hay;
      } else if (typeof hay === 'object' && hay.path && hay.methods && Array.isArray(hay.methods)) {
        stringToCheck = hay.path;
        methodsToCheck = hay.methods.map((method: string) => method.toLowerCase());
      } else {
        throw new Error('Invalid inject object passed to globCheck, expected either a string or {path: string, methods: string[]}. Got instead: ' + JSON.stringify(hay));
      }
      const isMatch = picomatch(stringToCheck, picoOptions);
      if (isMatch(needle)) {
        if (methodsToCheck) {
          // when an object this only return true if the method is found
          if (methodsToCheck.includes(currentMethod.toLowerCase())) {
            resp = true;
          }
        } else {
          resp = true;
        }
      }
    });
    return resp;
  }

  /**
   * Map filenames to routes so that exclude paths can be
   * calculated from the input filename
   *
   * @param {string}  yaml       The YAML of a path or channel index
   * @param {string}  inputPath  Path to YAML index file
   */
  mapIndex (yaml: string, inputPath: string) {
    const indexRoute = upath.dirname(inputPath);
    const index = jsYaml.safeLoad(yaml);
    Object.entries(index).forEach(([route, methods]) => {
      Object.values(methods).forEach((methodToFileRef: any) => {
        if (methodToFileRef && methodToFileRef.$ref) {
          const fullPath = `${indexRoute}/${methodToFileRef.$ref.replace('./', '')}`;
          this.fileToRouteMap[fullPath] = route;
        }
      });
    });
  }

  convertRootRefToRelative (content: string, relativePathToRoot: string) {
    return content
      .replace(/(\$ref[ '"]*:[ '"]*)#\/([^ '"$]*)/g, (_: any, ref: any, rootRef: any) => {
        const newPath = `${upath.dirname(rootRef)}/index.yml#/${upath.basename(rootRef)}`;
        return `${ref}${relativePathToRoot}/${newPath}`;
      })
      .replace(/(\$ref[ '"]*:[ '"]*)\$\/([^ '"$]*)/g, (_: any, ref: any, rootRef: any) => {
        return `${ref}${relativePathToRoot}/${rootRef}`;
      });
  }
}

export default new Injector();
