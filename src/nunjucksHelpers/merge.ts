import upath from 'upath';
import fs from 'fs-extra';
import jsYaml from 'js-yaml';
import deepmerge from 'deepmerge';

export default function(): string {
  const tplGlobals = this.env.globals;

  let main = {};

  for (const key in arguments) {
    if (arguments.hasOwnProperty(key)) {
      // eslint-disable-next-line prefer-rest-params
      const injectPath = upath.join(upath.dirname(tplGlobals.currentFilePointer), arguments[key]);
      if (!fs.pathExistsSync(injectPath)) {
        throw new Error('Path not found when trying to make optional: ' + injectPath);
      }
      const content: any = jsYaml.load(fs.readFileSync(injectPath, 'utf-8'));
      if (content && content['type'] !== 'object') {
        throw new TypeError('Referenced item must be an object: ' + injectPath);
      }
      main = deepmerge(main, content);
    }
  }

  return jsYaml.dump(main);
}
