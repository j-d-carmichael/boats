const path = require('path')
const fs = require('fs-extra')
const nunjucks = require('nunjucks')

module.exports = function () {
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
