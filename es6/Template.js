import path from 'path'
import * as nunjucks from 'nunjucks'
import fs from 'fs-extra'
import UniqueOperationIds from './UniqueOperationIds'
import calculateIndentFromLineBreak from './calculateIndentFromLineBreak'

class Template {
  /**
   *
   * @param inputString The string to parse
   * @param fileLocation The file location the string derived from
   * @param originalIndentation The original indentation
   * @param stripValue The opid strip value
   * @param customVars Custom variables passed to nunjucks
   * @returns {Promise<*>}
   */
  async load (inputString, fileLocation, originalIndentation, stripValue, customVars = {}) {
    this.currentFilePointer = fileLocation
    this.originalIndentation = originalIndentation
    this.stripValue = stripValue
    this.mixinVarNamePrefix = 'var'
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
    env.addGlobal( 'mixin', this.mixin)
    env.addGlobal( 'mixinNumber', this.mixinNumber)
    env.addGlobal( 'mixinObject', this.mixinObject)
    env.addGlobal( 'mixinVarNamePrefix', this.mixinVarNamePrefix)
    env.addGlobal( 'uniqueOpId', this.uniqueOpId)
    env.addGlobal( 'uniqueOpIdStripValue', this.stripValue)
    env.addGlobal( 'currentFilePointer', this.currentFilePointer)
    for(let key in customVars){
      env.addGlobal( key, customVars[key])
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
