import nunjucks, { renderString } from 'nunjucks';
import fs from 'fs-extra';
import upath from 'upath';
import SnippetsFetch from '@/SnippetsFetch';
import { dirListFilesSync } from '@/utils/dirListFilesSync';

interface ISnippets {
  injectSnippet: string,
  subSnippetPath?: string,
  relativeTargetPath: string,
  targetName: string
}

export default class Snippets {
  constructor (input: ISnippets) {
    this.nunjucksSetup();
    this.copySnippet(
      input.injectSnippet,
      input.subSnippetPath,
      input.relativeTargetPath,
      input.targetName
    ).then((target) => {
      this.renderPlacedSnippet(target, input)
        .then(() => {
          console.log('Done');
        })
        .catch((e) => {
          console.error(e);
        });
    }).catch((e) => {
      console.error(e);
    });
  }

  nunjucksSetup (): void {
    nunjucks.configure({
      tags: {
        blockStart: '~~%',
        blockEnd: '%~~',
        variableStart: '~~$',
        variableEnd: '$~~',
        commentStart: '~~#',
        commentEnd: '#~~'
      }
    });
  }

  async copySnippet (snippetName: string, subSnippetPath = '', relativeTargetPath: string, name: string): Promise<string> {
    let localSnippetPath = await SnippetsFetch.resolve(snippetName);
    if (subSnippetPath !== '') {
      localSnippetPath = upath.join(localSnippetPath, subSnippetPath);
    }
    const targetPath = upath.join(process.cwd(), relativeTargetPath, name);
    fs.ensureDirSync(targetPath);
    const filter = (src: string): boolean => {
      // do not return true for .git paths
      return src.indexOf('.git') === -1;
    };
    fs.copySync(localSnippetPath, targetPath, { filter });
    return targetPath;
  }

  renderPlacedSnippet (targetPath: string, data: Record<any, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      const files: string[] = dirListFilesSync(targetPath);
      files.forEach((file) => {
        try {
          const rendered = renderString(fs.readFileSync(file, 'utf8'), data);
          fs.outputFileSync(file, rendered);
        } catch (e) {
          console.error(`Error parsing nunjucks file ${file}: `);
          return reject(e);
        }
      });

      resolve();
    });
  }
}
