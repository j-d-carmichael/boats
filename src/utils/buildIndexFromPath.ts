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

  return enableFancyPluralization && rawIndex.endsWith(`${trim}s`)
    ? pluralize.plural(rawIndex.replace(`${trim}s`, ''))
    : rawIndex.replace(trim, '');
}
