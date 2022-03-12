import { sep } from 'upath';
import getMethodFromFileName from '@/utils/getMethodFromFileName';

export default (filePath: string): string => {
  return getMethodFromFileName(
    filePath.split(sep).pop()
  );
}
