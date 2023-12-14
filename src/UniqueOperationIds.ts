import _ from 'lodash';
import lcFirst from '@/lcFirst';
import upath, { sep } from 'upath';
import removeFileExtension from '@/removeFileExtension';
import { methods } from '@/constants/methods';
import { StringStyle } from '@/enums/StringStyle';
import ucFirst from '@/ucFirst';

export interface GetUniqueOperationIdFromPath {
  filePath: string,
  stripValue: string,
  tails?: string | string[],
  cwd?: string,
  removeMethod?: boolean,
  style?: StringStyle,
  segmentStyle?: StringStyle,
  firstSegmentSplit?: '.' | '-' | '_'
  allSegmentSplit?: '.' | '-' | '_'
  prefixes?: string[],
  replacements?: { find: string, replace: string }[]
}

class UniqueOperationIds {
  // eslint-disable-next-line max-lines-per-function
  getUniqueOperationIdFromPath (input: GetUniqueOperationIdFromPath): string {

    const { stripValue, removeMethod, prefixes, firstSegmentSplit } = input;
    const cwd = input.cwd || upath.toUnix(process.cwd());
    const segmentStyle = input.segmentStyle || StringStyle.camelCase;
    const style = input.style || StringStyle.camelCase;
    let filePath = input.filePath.replace(cwd, '');

    // Ensure tails is an array
    let tails = typeof input.tails === 'string' ? [input.tails] : input.tails || [];
    tails = tails.filter((tail) => tail.length > 0);

    filePath = removeFileExtension(filePath.replace(stripValue, ''));

    // split the path into parts governed by the path separator, sep used for unix and windows compatibility
    let filePathParts = filePath.split(sep);

    // firstSegmentSplit is the highlight the 1st
    let iterationToNotCaseChange = -1;
    if (firstSegmentSplit) {
      iterationToNotCaseChange = 0;
    }

    // inject the prefixes if given
    if (prefixes && prefixes.length > 0) {
      if (firstSegmentSplit) {
        iterationToNotCaseChange = prefixes.length - 1;
      }
      filePathParts = prefixes.concat(filePathParts);
    }

    for (let i = 0; i < filePathParts.length; ++i) {
      if (filePathParts[i] !== sep) {
        switch (segmentStyle) {
          case StringStyle.snakeCase:
            filePathParts[i] = _.snakeCase(this.removeCurlys(filePathParts[i]));
            break;
          case StringStyle.PascalCase:
            filePathParts[i] = ucFirst(_.camelCase(this.removeCurlys(filePathParts[i])));
            break;
          case StringStyle.kebabCase:
            filePathParts[i] = _.kebabCase(this.removeCurlys(filePathParts[i]));
            break;
          case StringStyle.asIs:
            filePathParts[i] = this.removeCurlys(filePathParts[i]);
            break;
          default:
            filePathParts[i] = _.camelCase(this.removeCurlys(filePathParts[i]));
            break;
        }
        // upper case for camel and pascal for overall styling
        if ([StringStyle.camelCase, StringStyle.PascalCase].includes(style)) {
          filePathParts[i] = ucFirst(filePathParts[i]);
          if (iterationToNotCaseChange !== -1 && (i - 1) === iterationToNotCaseChange) {
            filePathParts[i] = lcFirst(filePathParts[i]);
          }
        }
        // Add the split highlight
        if (i === iterationToNotCaseChange) {
          filePathParts[i] += firstSegmentSplit;
        }
      }
    }

    if (removeMethod) {
      if (methods.includes(filePathParts[filePathParts.length - 1].toLowerCase())) {
        filePathParts.pop();
      }
    }
    if (tails) {
      filePathParts = filePathParts.concat(tails);
    }

    let operationId = '';

    switch (style) {
      case StringStyle.kebabCase:
        operationId = lcFirst(filePathParts.join('-'));
        break;
      case StringStyle.PascalCase:
        operationId = filePathParts.join('');
        break;
      case StringStyle.snakeCase:
        operationId = filePathParts.join('_');
        break;
      case StringStyle.dotNotation:
        operationId = filePathParts.join('.');
        break;
      default:
        operationId = lcFirst(filePathParts.join(''));
        break;
    }

    // lastly, if we have any replacements, apply them now
    if (input.replacements && input.replacements.length) {
      input.replacements.forEach((replacement) => {
        operationId = operationId.split(replacement.find).join(replacement.replace);
      });
    }

    return operationId;
  }

  /**
   * Strings the path param curlies from a folder name
   */
  removeCurlys (input: string): string {
    return input.replace('{', '').replace('}', '');
  }
}

export default new UniqueOperationIds();
