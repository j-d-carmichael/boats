import upath from 'upath';
import { TMP_COMPILED_DIR_NAME } from '@/constants';
import fs from 'fs-extra';

export default (outputDirectory: string) => {
  const fullPath = upath.join(
    process.cwd(),
    outputDirectory,
    TMP_COMPILED_DIR_NAME
  );
  if (fs.existsSync(fullPath)) {
    fs.removeSync(fullPath);
  }
}
