import upath from 'upath';
import buildIndexFromPath from '@/utils/buildIndexFromPath';

interface RefGeneratorOptions {
  componentsPath: string;
}

export default function (currentFilePointer: string, fileName: string, options: RefGeneratorOptions) {
  const dir = upath.dirname(currentFilePointer);

  const lastSegment = dir.substring(dir.indexOf(options.componentsPath) + options.componentsPath.length);

  const fullPath = upath.normalize(upath.join(lastSegment, fileName));
  return `"#/${options.componentsPath}/${buildIndexFromPath(fullPath, {})}"`;
}
