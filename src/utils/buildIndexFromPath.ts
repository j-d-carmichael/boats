import upath from 'upath';
import getMethodFromFileName from '@/utils/getMethodFromFileName';
import ucFirst from '@/ucFirst';
import removeFileExtension from '@/removeFileExtension';
import _ from 'lodash';
import pluralize from 'pluralize';

export default function buildIndexFromPath(cleanPath: string, trimOpts?: any, enableFancyPluralization?: boolean): string {
  const dir = upath.dirname(cleanPath);
  const filename = upath.basename(cleanPath);
  const method = getMethodFromFileName(filename);
  let _path = cleanPath;
  if (trimOpts && trimOpts.dropBaseName && new RegExp(method + '$', 'i').test(_.camelCase(dir))) {
    _path = cleanPath.replace(filename, '');
  }
  const trim = typeof trimOpts === 'string' ? trimOpts : '';
  const rawIndex = ucFirst(_.camelCase(removeFileExtension(_path)));
  const isPlural = rawIndex.endsWith(`${trim}s`);

  if (!isPlural || !enableFancyPluralization) {
    return rawIndex.replace(trim, '');
  }

  const index = pluralize.plural(rawIndex.replace(`${trim}s`, ''));

  // Add an extra "s" to words which are the same in both plural and non-plural form (i.e. sheep)
  return isPlural && rawIndex === index
    ? `${index}s`
    : index;
}
