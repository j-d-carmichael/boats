import { readdirSync } from 'fs';
import path from 'path';
import YAML from 'js-yaml';
import _ from 'lodash';
import ucFirst from '@/ucFirst';
import removeFileExtension from '@/removeFileExtension';
import { GetIndexYamlOptions } from '@/interfaces/GetIndexYamlOptions';

class AutoIndexer {
  getFiles(dir: string) {
    const dirents = readdirSync(dir, { withFileTypes: true });
    const files: any = dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? this.getFiles(res) : res;
    });
    return Array.prototype.concat(...files);
  }

  cleanFilePaths(dir: string, filePaths: string[], indexFile: string): string[] {
    return filePaths.map((filePath) => {
      return filePath !== indexFile && filePath.replace(dir, '');
    });
  }

  getMethodFromFileName(fileName: string): string {
    return fileName.split('.')[0];
  }

  buildPathsYamlString(cleanPaths: string[], channels?: any, components?: any, paths?: any, trimOpts?: any) {
    const indexObject: any = {};
    cleanPaths.forEach((cleanPath) => {
      if (cleanPath) {
        const dir = path.dirname(cleanPath);
        const filename = path.basename(cleanPath);
        const method = this.getMethodFromFileName(filename);
        if (paths) {
          indexObject[dir] = indexObject[dir] || {};
          indexObject[dir][method] = {
            $ref: `.${cleanPath}`,
          };
        }
        if (channels) {
          indexObject[removeFileExtension(cleanPath)] = {
            $ref: `.${cleanPath}`,
          };
        }
        if (components) {
          //remove = remove || '';
          let _path = cleanPath;
          if (trimOpts && trimOpts.dropBaseName && new RegExp(method + '$', 'i').test(_.camelCase(dir))) {
            _path = cleanPath.replace(filename, '');
          }
          const trim = typeof trimOpts === 'string' ? trimOpts : '';
          indexObject[ucFirst(_.camelCase(removeFileExtension(_path))).replace(trim, '')] = {
            $ref: `.${cleanPath}`,
          };
        }
      }
    });
    return YAML.safeDump(indexObject, {
      indent: 2,
    });
  }

  /**
   * Returns a string from an auto-built yaml file
   */
  getIndexYaml(indexFile: string, options: GetIndexYamlOptions) {
    const absoluteIndexFilePath = path.join(process.cwd(), indexFile);
    const dir = path.join(process.cwd(), path.dirname(indexFile));
    const files = this.getFiles(dir);
    const cleanPaths = this.cleanFilePaths(dir, files, absoluteIndexFilePath);
    return this.buildPathsYamlString(cleanPaths, options.channels, options.components, options.paths, options.remove);
  }
}

export default new AutoIndexer();
