import upath from 'upath';
import { TMP_COMPILED_DIR_NAME } from '@/constants';
import fs from 'fs-extra';

export default (inputDirectory: string) => {
  const fullTmpPath = upath.join(
    process.cwd(),
    // add the tmp folder name or not
    upath.dirname(inputDirectory) + TMP_COMPILED_DIR_NAME
  );
  if (fs.existsSync(fullTmpPath)) {
    fs.removeSync(fullTmpPath);
  }
}
