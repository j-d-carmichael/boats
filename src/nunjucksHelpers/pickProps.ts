import upath from 'upath';
import fs from 'fs-extra';
import jsYaml from 'js-yaml';
import _ from 'lodash';

export default function (defPath: string, ...rest: string[]): string {
  const tplGlobals = this.env.globals;

  // eslint-disable-next-line prefer-rest-params
  const injectPath = upath.join(upath.dirname(tplGlobals.currentFilePointer), defPath);

  if (!fs.pathExistsSync(injectPath)) {
    throw new Error('Path not found when trying to make optional: ' + injectPath);
  }

  const content: any = jsYaml.safeLoad(fs.readFileSync(injectPath, 'utf-8'));

  if (content && content['type'] !== 'object') {
    throw new TypeError('Referenced item must be an object: ' + injectPath);
  }

  content.properties = _.pick(content.properties, _.flatten(rest));

  if(Array.isArray(content.required)){
    content.required = content.required.filter((i:string) => _.flatten(rest).includes(i));
  }

  const text = jsYaml.safeDump(content);

  const parts = text.split('\n');
  const first = parts.pop();

  for (let i = 1; i < parts.length; i++) {
    parts[i] = tplGlobals.indentObject[tplGlobals.indentNumber].linePadding + parts[i];
  }
  ++this.env.globals.indentNumber;
  return first + parts.join('\n');
}
