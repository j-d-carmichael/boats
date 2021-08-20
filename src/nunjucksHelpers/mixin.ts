import upath from 'upath';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';

const mixinDirectoryKey = 'mixinDirectory';

export default function (): string {
  const tplGlobals = this.env.globals;
  // eslint-disable-next-line prefer-rest-params
  let argumentPath = arguments[0]

  if (argumentPath.match(/\$/g)) {
    const diff = upath.relative(upath.dirname(tplGlobals.currentFilePointer), tplGlobals.baseDir);

    argumentPath = upath.normalize(argumentPath.replace('$', diff));
  }

  const renderPath = upath.join(upath.dirname(tplGlobals.currentFilePointer), argumentPath);

  if (!fs.pathExistsSync(renderPath)) {
    throw new Error('Path not found when trying to render mixin: ' + renderPath);
  }

  const vars: any = {};

  const mixinObj = tplGlobals.mixinObject[tplGlobals.mixinNumber];

  vars[mixinDirectoryKey] = upath.dirname(mixinObj.mixinPath)

  let skipAutoIndex = false;
  for (let i = 1; i < arguments.length; ++i) {
    if (arguments[i] === '--skip-auto-indent') {
      skipAutoIndex = true;
    } else {
      vars[tplGlobals.mixinVarNamePrefix + i] = arguments[i];
    }
  }
  const replaceVal = `
`;
  const rendered = nunjucks.render(renderPath, vars);
  // inject the indentation
  if (skipAutoIndex) {
    return rendered;
  } else {
    const parts = rendered.split('\n');
    parts.forEach((part, i) => {
      parts[i] = mixinObj.mixinLinePadding + part;
    });
    ++this.env.globals.mixinNumber;
    return replaceVal + parts.join('\n');
  }
}
