import _ from 'lodash';
import lcFirst from '@/lcFirst';
import removeFileExtension from '@/removeFileExtension';
import { methods } from '@/constants/methods';
import { StringStyle } from '@/enums/StringStyle';
import ucFirst from '@/ucFirst';

class UniqueOperationIds {
  // eslint-disable-next-line max-lines-per-function
  getUniqueOperationIdFromPath (
    filePath: string,
    stripValue: string,
    tail = '',
    cwd?: string,
    removeMethod?: boolean,
    style: StringStyle = StringStyle.camelCase,
    segmentStyle: StringStyle = StringStyle.camelCase,
    prefixes?: string[]
  ): string {
    tail = tail || '';
    cwd = cwd || process.cwd();
    filePath = filePath.replace(cwd, '');
    filePath = removeFileExtension(filePath.replace(stripValue, ''));
    let filePathParts = filePath.split('/');
    // inject the prefixes if given
    if(prefixes && prefixes.length > 0){
      filePathParts = prefixes.concat(filePathParts)
    }
    for (let i = 0; i < filePathParts.length; ++i) {
      if (filePathParts[i] !== '/') {
        switch (segmentStyle){
          case StringStyle.snakeCase:
            filePathParts[i] = _.snakeCase(this.removeCurlys(filePathParts[i]));
            break;
          case StringStyle.PascalCase:
            filePathParts[i] = ucFirst(_.camelCase(this.removeCurlys(filePathParts[i])));
            break;
          case StringStyle.kebabCase:
            filePathParts[i] = _.kebabCase(this.removeCurlys(filePathParts[i]));
            break;
          default:
            filePathParts[i] = _.camelCase(this.removeCurlys(filePathParts[i]));
            break;
        }
        // upper case for camel and pascal for overall styling
        if ([StringStyle.camelCase, StringStyle.PascalCase].includes(style)) {
          filePathParts[i] = ucFirst(filePathParts[i]);
        }
      }
    }
    if (removeMethod) {
      if (methods.includes(filePathParts[filePathParts.length - 1].toLowerCase())) {
        filePathParts.pop();
      }
    }
    if (tail) {
      filePathParts.push(tail);
    }
    switch (style) {
      case StringStyle.kebabCase:
        return lcFirst(filePathParts.join('-'));
      case StringStyle.camelCase:
        return lcFirst(filePathParts.join(''));
      case StringStyle.PascalCase:
        return filePathParts.join('');
      case StringStyle.snakeCase:
        return filePathParts.join('_');
    }
  }

  /**
   * Strings the path param curlies from a folder name
   */
  removeCurlys (input: string): string {
    return input.replace('{', '').replace('}', '');
  }
}

export default new UniqueOperationIds();
