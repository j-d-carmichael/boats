import path from 'path'
import fs from 'fs-extra'
import nunjucks from 'nunjucks'

export default function (): string {
  const tplGlobals = this.env.globals
  // eslint-disable-next-line prefer-rest-params
  const renderPath = path.join(path.dirname(tplGlobals.currentFilePointer), arguments[0])
  if (!fs.pathExistsSync(renderPath)) {
    throw new Error('Path not found when trying to render mixin: ' + renderPath)
  }
  const vars: any = {}
  let skipAutoIndex = false
  for (let i = 1; i < arguments.length; ++i) {
    if (arguments[i] === '--skip-auto-indent') {
      skipAutoIndex = true
    } else {
      vars[tplGlobals.mixinVarNamePrefix + i] = arguments[i]
    }
  }
  const replaceVal = `
`
  const rendered = nunjucks.render(renderPath, vars)
  // inject the indentation
  if (skipAutoIndex) {
    return rendered
  } else {
    const parts = rendered.split('\n')
    parts.forEach((part, i) => {
      parts[i] = tplGlobals.mixinObject[tplGlobals.mixinNumber].mixinLinePadding + part
    })
    ++this.env.globals.mixinNumber
    return replaceVal + parts.join('\n')
  }
}
