import upath from 'upath';
import buildIndexFromPath from '@/utils/buildIndexFromPath';
import { BoatsRC } from '@/interfaces/BoatsRc';

interface RefGeneratorOptions {
  componentsPath: string;
}

export default function (currentFilePointer: string, fileName: string, options: RefGeneratorOptions, boatsrc: BoatsRC): string {
  const dir = upath.dirname(currentFilePointer);

  const lastSegment = dir.substring(dir.indexOf(options.componentsPath) + options.componentsPath.length);
  const fullPath = upath.normalize(upath.join(lastSegment, fileName));
  return `"#/${options.componentsPath}/${buildIndexFromPath(fullPath, {}, boatsrc.fancyPluralization)}"`;
}
