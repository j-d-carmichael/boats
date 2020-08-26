import path from 'path';
import deepmerge from 'deepmerge';
import jsYaml from 'js-yaml';
import picomatch from 'picomatch';
import { render, renderString } from 'nunjucks';

class Injector {
  fileToRouteMap: any;

  constructor () {
    this.fileToRouteMap = {};
  }

  /**
   * Render the base template and inject content if provided
   */
  injectAndRender (inputPath: string, inputIndexYaml: string, boatsRc: any): string {
    const fullPath = path.join(process.cwd(), inputPath);
    const relativePathToRoot = path.relative(path.dirname(inputPath), path.dirname(inputIndexYaml));
    const picomatchOptions = boatsRc.picomatchOptions || { bash: true };
    const yaml = this.convertRootRefToRelative(render(fullPath), relativePathToRoot);

    if (!global.boatsInject) {
      return yaml;
    }

    if (!/\/(paths|channels)\//.test(inputPath)) {
      return yaml;
    }

    if (/index\./.test(path.basename(inputPath))) {
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
      exclude: [], /* << deprecated and will be removed in the a future release */
      excludeChannels: [],
      includeOnlyChannels: [],
      excludePaths: [],
      includeOnlyPaths: [],
      includeMethods: [],
      ...injection,
    };
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
    const methodName = path.basename(inputPath).replace(/\..*/, '');

    const shouldSkipMethod = (method: string): boolean => {
      if (injectRule.includeMethods.length) {
        const methodsRegex = new RegExp(`\\b(${injectRule.includeMethods.join('|')})\\b`, 'i');
        return !methodsRegex.test(method);
      }
      return false;
    };

    if (/channels/.test(inputPath)) {
      // Exclude paths
      if (this.globCheck(operationName, injectRule.excludeChannels, picomatchOptions)) {
        return false;
      }
      if (this.globCheck(operationName, injectRule.exclude, picomatchOptions)) {
        return false;
      }
      // Specifically include a path
      if (injectRule.includeOnlyChannels.length > 0 && !this.globCheck(operationName, injectRule.includeOnlyChannels, picomatchOptions)) {
        return false;
      }
      // include method
      if (shouldSkipMethod(methodName)) {
        return false;
      }
    }
    if (/paths/.test(inputPath)) {
      // Exclude a path completely
      if (this.globCheck(operationName, injectRule.excludePaths, picomatchOptions)) {
        return false;
      }
      // Specifically include a path
      if (injectRule.includeOnlyPaths.length > 0 && !this.globCheck(operationName, injectRule.includeOnlyPaths, picomatchOptions)) {
        return false;
      }
      // include method
      if (shouldSkipMethod(methodName)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Pico matching the path against the rules in the inject object
   * @param needle
   * @param haystack
   * @param picoOptions node_modules/@types/picomatch/index.d.ts  PicomatchOptions  not exported from the types
   */
  globCheck (needle: string, haystack: string[], picoOptions: any): boolean {
    let resp = false;
    if (typeof needle !== 'string') {
      // catch for tpl not included in a manual index file
      return resp;
    }
    haystack.forEach((hay: string) => {
      const isMatch = picomatch(hay, picoOptions);
      if (isMatch(needle)) {
        resp = true;
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
    const indexRoute = path.dirname(inputPath);
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
    return content.replace(/(\$ref[ '"]*:[ '"]*)#\/([^ '"$]*)/g, (_: any, ref: any, rootRef: any) => {
      const newPath = `${path.dirname(rootRef)}/index.yml#/${path.basename(rootRef)}`;
      return `${ref}${relativePathToRoot}/${newPath}`;
    });
  }
}

export default new Injector();
