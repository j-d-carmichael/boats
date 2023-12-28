import upath from 'upath';
import getMethodFromFileName from '@/utils/getMethodFromFileName';
import ucFirst from '@/ucFirst';
import removeFileExtension from '@/removeFileExtension';
import _ from 'lodash';
import pluralize from 'pluralize';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function buildIndexFromPath (input: {
  cleanPath: string,
  autoComponentIndexerOptions?: any,
  enableFancyPluralization?: boolean,
  dontUcFirst?: boolean
}): string {
  const { cleanPath, autoComponentIndexerOptions, enableFancyPluralization, dontUcFirst } = input;
  const dir = upath.dirname(cleanPath);
  const filename = upath.basename(cleanPath);
  const method = getMethodFromFileName(filename);
  let _path = cleanPath;
  if (autoComponentIndexerOptions && autoComponentIndexerOptions.dropBaseName && new RegExp(method + '$', 'i').test(_.camelCase(dir))) {
    _path = cleanPath.replace(filename, '');
  }
  const trim = typeof autoComponentIndexerOptions === 'string' ? autoComponentIndexerOptions : '';
  let rawIndex = _.camelCase(removeFileExtension(_path));
  if (!dontUcFirst) {
    rawIndex = ucFirst(rawIndex);
  }

  const isPlural = trim && rawIndex.endsWith(`${trim}s`);

  if (!isPlural) {
    return rawIndex.replace(new RegExp(`${trim}$`), '');
  }

  if (!enableFancyPluralization) {
    return rawIndex.replace(new RegExp(`${trim}s$`), 's');
  }

  const trimmedIndex = rawIndex.replace(new RegExp(`${trim}s$`), '');
  const pluralIndex = pluralize.plural(trimmedIndex);

  // Add an extra "s" to words which are the same in both plural and non-plural form (i.e. sheep)
  return isPlural && trimmedIndex === pluralIndex
    ? `${pluralIndex}s`
    : pluralIndex;
}
