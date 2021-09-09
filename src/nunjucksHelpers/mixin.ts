import upath from 'upath';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import { pathInjector } from '../pathInjector';

const mixinDirectoryKey = 'mixinDirectory';

function parseMixinPath(mixinPath: string, pathInjector: pathInjector, currentFilePointer: string): string {
  // Don't forget to parse the mixin path, as that could have been defined as an absolute path
  // Maybe should be done when setting mixinPath initially
  // eslint-disable-next-line prefer-const
  let [parsedMixinPath, absolute] = pathInjector.injectMixin(mixinPath);

  if (absolute) {
    parsedMixinPath = upath.relative(upath.dirname(currentFilePointer), parsedMixinPath);
  }

  return upath.dirname(upath.normalize(parsedMixinPath));
}

export default function (): string {
  const tplGlobals = this.env.globals;
  const pathInjector = (tplGlobals.pathInjector) as pathInjector;

  // eslint-disable-next-line prefer-rest-params
  const [argumentPath, isAbsolute] = pathInjector.injectMixin(arguments[0])

  const renderPath = isAbsolute
    ? argumentPath
    : upath.join(upath.dirname(tplGlobals.currentFilePointer), argumentPath);

  if (!fs.pathExistsSync(renderPath)) {
    throw new Error('Path not found when trying to render mixin: ' + renderPath);
  }

  const vars: any = {};

  const mixinObj = tplGlobals.mixinObject[tplGlobals.mixinNumber];
  vars[mixinDirectoryKey] = parseMixinPath(mixinObj.mixinPath, pathInjector, tplGlobals.currentFilePointer);

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
