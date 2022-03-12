import { upperFirst } from 'lodash';
import { sep } from 'upath';
import getMethodFromFileName from '@/utils/getMethodFromFileName';

const summaryVerbReplacements = {
  get: 'Get',
  post: 'Create a',
  put: 'Update a',
  patch: 'Update part of a',
  delete: 'Delete a'
};

const isVar = (part: string): boolean => {
  return part.includes('{');
};

export default (filePath: string): string => {
  const parts = filePath.split(sep);

  // @ts-ignore
  const method = summaryVerbReplacements[getMethodFromFileName(parts.pop())];

  let out = `${upperFirst(method)}`;

  if (!parts.length) {
    return out;
  }

  parts.reverse();

  for (let i = 0; i < parts.length; i++) {
    const first = i === 0;
    if (isVar(parts[i])) {
      //
      const variable = parts[i];
      ++i;
      const word = parts[i];
      if (first) {
        out += ` ${word} based on ${variable}`;
      } else {
        out += `, from ${word} ${variable}`;
      }
    } else {
      if (first) {
        out += ' ' + parts[i];
      } else {
        out += ', from ' + parts[i];
      }
    }
  }

  return out;
}

