import deepmerge from 'deepmerge';
import jsYaml from 'js-yaml';
import { render, renderString } from 'nunjucks';
import path from 'path';

class Injector {
  fileToRouteMap: any;

  constructor() {
    this.fileToRouteMap = {};
  }

  /**
   * Render the base template and inject content if provided
   */
  injectAndRender(inputPath: string, inputIndexYaml: string): string {
    const fullPath = path.join(process.cwd(), inputPath);
    const yaml = render(fullPath);

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

    const relativePathToRoot = path.relative(path.dirname(inputPath), path.dirname(inputIndexYaml));
    for (const { toAllOperations } of global.boatsInject) {
      if (this.shouldInject(toAllOperations, inputPath)) {
        jsonTemplate = this.mergeInjection(
          jsonTemplate,
          relativePathToRoot,
          toAllOperations.content
        );
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
  mergeInjection(jsonTemplate: any, relativePathToRoot: string, content: string | any): any {
    if (!jsonTemplate || !content) {
      return jsonTemplate;
    }

    if (typeof content === 'object') {
      content = JSON.stringify(content);
    }
    content = content.replace(
      /(\$ref[ '"]*:[ '"]*)#\/([^ '"$]*)/g,
      (_: any, ref: any, rootRef: any) => {
        const newPath = `${path.dirname(rootRef)}/index.yml#/${path.basename(rootRef)}`;
        return `${ref}${relativePathToRoot}/${newPath}`;
      }
    );
    const renderedString = renderString(content, {});

    const injectionContent = jsYaml.safeLoad(renderedString);

    return deepmerge(jsonTemplate, injectionContent);
  }

  /**
   * Checks if the content should be injected
   *
   * @param  {object}   injection  Injection rule
   * @param  {string}   inputPath  Path to target file
   *
   * @return {boolean}  True if the path satisfies the rule
   */
  shouldInject(injection: any, inputPath: string) {
    if (!injection) {
      return false;
    }

    const injectRule = {
      exclude: [],
      excludePaths: [],
      includeMethods: [],
      ...injection,
    };

    const operationName = this.fileToRouteMap[inputPath];
    const methodName = path.basename(inputPath).replace(/\..*/, '');

    const shouldSkipMethod = (method: string): boolean => {
      if (injectRule.includeMethods.length) {
        const methodsRegex = new RegExp(`\\b(${injectRule.includeMethods.join('|')})\\b`, 'i');
        return !methodsRegex.test(method);
      }
      return false;
    };

    if (/channels/.test(inputPath) && injectRule.exclude.includes(operationName)) {
      return false;
    }
    if (
      /paths/.test(inputPath) &&
      (injectRule.excludePaths.includes(operationName) || shouldSkipMethod(methodName))
    ) {
      return false;
    }

    return true;
  }

  /**
   * Map filenames to routes so that exclude paths can be
   * calculated from the input filename
   *
   * @param {string}  yaml       The YAML of a path or channel index
   * @param {string}  inputPath  Path to YAML index file
   */
  mapIndex(yaml: string, inputPath: string) {
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
}

export default new Injector();
