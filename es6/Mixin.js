import path from 'path'
import * as nunjucks from 'nunjucks'
import functionParamsFromStr from './functionParamsFromStr'
import fs from 'fs-extra'
import calculateIndentFromLineBreak from './calculateIndentFromLineBreak'

class Mixin {
  injector (inputString, fileLocation, originalIndentation) {
    return new Promise((resolve, reject) => {
      try {
        let mixinRegex = /'?(mixin\(.*\))'?/
        let mixinStr = inputString.match(mixinRegex)
        if (!mixinStr) {
          return resolve(inputString)
        }
        let indent = calculateIndentFromLineBreak(inputString, mixinStr.index) + originalIndentation
        let replaceVal = `
`
        let linePadding = ''
        for (let i = 0; i < indent; ++i) {
          linePadding += ' '
        }
        replaceVal += this.parser(mixinStr[0], fileLocation, linePadding)
        return resolve(inputString.replace(
          mixinStr[0],
          replaceVal
        ))
      } catch (e) {
        reject(e)
      }
    })
  }

  parser (val, currentFilePointer, linePadding) {
    if (typeof val === 'string' && val.indexOf('mixin(') !== -1) {
      const params = functionParamsFromStr(val)
      let mixinPath = ''
      let vars = {}
      params.forEach((param, i) => {
        if (i > 0) {
          vars['var' + i] = param
        } else {
          mixinPath = param
        }
      })
      nunjucks.configure({ autoescape: false })
      const renderPath = path.join(path.dirname(currentFilePointer), mixinPath)
      if (!fs.pathExistsSync(renderPath)) {
        throw new Error('Path not found when trying to render mixin: ' + renderPath)
      }
      let rendered = nunjucks.render(renderPath, vars)
      // inject the indentation
      let parts = rendered.split('\n')
      parts.forEach((part, i) => {
        parts[i] = linePadding + part
      })
      return parts.join('\n')
    }

    return val
  }
}

export default new Mixin()
