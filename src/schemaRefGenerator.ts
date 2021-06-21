import path from 'path';
import buildIndexFromPath from '@/utils/buildIndexFromPath';

interface RefGeneratorOptions {
  componentsPath: string;
}

export default function (currentFilePointer: string, fileName: string, options: RefGeneratorOptions) {
  const dir = path.dirname(currentFilePointer);

  const lastSegment = dir.substring(dir.indexOf(options.componentsPath) + options.componentsPath.length);

  const fullPath = path.normalize(path.join(lastSegment, fileName));
  return `"#/${options.componentsPath}/${buildIndexFromPath(fullPath, {})}"`;
}
