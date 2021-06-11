import { buildIndexFromPath } from '@/AutoIndexer';
import path from 'path';

const schemaFolder = 'components/schemas';

export default function (fileName: string): string {
  const dir = path.dirname(this.env.globals.currentFilePointer);

  const lastSegment = dir.substring(dir.indexOf(schemaFolder) + schemaFolder.length);

  const fullPath = path.normalize(path.join(lastSegment, fileName));
  return `"#/components/schemas/${buildIndexFromPath(fullPath, {})}"`;
}
