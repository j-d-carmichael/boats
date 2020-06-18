const deepmerge = require('deepmerge')
const jsYaml = require('js-yaml')
const nunjucks = require('nunjucks')
const path = require('path')

class Injector {
  constructor () {
    this.fileToRouteMap = {}
  }

  /**
   * Render the base template and inject content if provided
   *
   * @param  {string}  inputPath       Target template file
   * @param  {string}  inputIndexYaml  Root input YAML file
   *
   * @return {string}  YAML string
   */
  injectAndRender (inputPath, inputIndexYaml) {
    const fullPath = path.join(process.cwd(), inputPath)
    const yaml = nunjucks.render(fullPath)

    if (!global.boatsInject) {
      return yaml
    }

    if (!/\/(paths|channels)\//.test(inputPath)) {
      return yaml
    }

    if (/index\./.test(path.basename(inputPath))) {
      this.mapIndex(yaml, inputPath)
      return yaml
    }

    let jsonTemplate = jsYaml.safeLoad(yaml)

    const relativePathToRoot = path.relative(path.dirname(inputPath), path.dirname(inputIndexYaml))

    for (let { toAllOperations } of global.boatsInject) {
      if (this.shouldInject(toAllOperations, inputPath)) {
        jsonTemplate = this.mergeInjection(jsonTemplate, relativePathToRoot, toAllOperations.content)
      }
    }

    return jsYaml.safeDump(jsonTemplate)
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
  mergeInjection (jsonTemplate, relativePathToRoot, content) {
    if (!jsonTemplate || !content) {
      return jsonTemplate
    }

    if (typeof content === 'object') {
      content = JSON.stringify(content)
    }

    content = content.replace(/(\$ref[ '"]*:[ '"]*)#\/([^ '"$]*)/g, (_, ref, rootRef) => {
      const newPath = `${path.dirname(rootRef)}/index.yml#/${path.basename(rootRef)}`
      return `${ref}${relativePathToRoot}/${newPath}`
    })

    const injectionContent = jsYaml.safeLoad(nunjucks.renderString(content))

    return deepmerge(jsonTemplate, injectionContent)
  }

  /**
   * Checks if the content should be injected
   *
   * @param  {object}   injection  Injection rule
   * @param  {string}   inputPath  Path to target file
   *
   * @return {boolean}  True if the path satisfies the rule
   */
  shouldInject (injection, inputPath) {
    if (!injection) {
      return false
    }

    const {
      exclude,
      excludePaths,
      includeMethods,
    } = {
      exclude: [],
      excludePaths: [],
      includeMethods: [],
      ...injection,
    }

    const operationName = this.fileToRouteMap[inputPath]
    const methodName = path.basename(inputPath).replace(/\..*/, '')

    let shouldSkipMethod = () => false
    if (includeMethods.length) {
      const methodsRegex = new RegExp(`\\b(${includeMethods.join('|')})\\b`, 'i')
      shouldSkipMethod = (method) => !methodsRegex.test(method)
    }

    if (/channels/.test(inputPath) && exclude.includes(operationName)) {
      return false
    }
    if (/paths/.test(inputPath) && (excludePaths.includes(operationName) || shouldSkipMethod(methodName))) {
      return false
    }

    return true
  }

  /**
   * Map filenames to routes so that exclude paths can be
   * calculated from the input filename
   *
   * @param {string}  yaml       The YAML of a path or channel index
   * @param {string}  inputPath  Path to YAML index file
   */
  mapIndex (yaml, inputPath) {
    const indexRoute = path.dirname(inputPath)
    const index = jsYaml.safeLoad(yaml)
    Object.entries(index).forEach(([route, methods]) => {
      Object.values(methods).forEach(methodToFileRef => {
        if (methodToFileRef && methodToFileRef['$ref']) {
          const fullPath = `${indexRoute}/${methodToFileRef['$ref'].replace('./', '')}`
          this.fileToRouteMap[fullPath] = route
        }
      })
    })
  }
}

module.exports = new Injector()
