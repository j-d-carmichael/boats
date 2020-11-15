import nunjucks, { renderString } from 'nunjucks';
import fs from 'fs-extra';
import path from 'path';
import SnippetsFetch from '@/SnippetsFetch';

// No types found for walker
// eslint-disable-next-line @typescript-eslint/no-var-requires
const walker = require('walker');

interface ISnippets {
  injectSnippet: string,
  relativeTargetPath: string,
  targetName: string
}

export default class Snippets {
  constructor (input: ISnippets) {
    this.nunjucksSetup();
    this.copySnippet(
      input.injectSnippet,
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

  async copySnippet (
    snippetName: string,
    relativeTargetPath: string,
    name: string
  ): Promise<string> {
    const localSnippetPath = await SnippetsFetch.resolve(snippetName);
    const targetPath = path.join(process.cwd(), relativeTargetPath, name);
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
      walker(targetPath)
        .on('file', (file: string) => {
          try {
            const rendered = renderString(fs.readFileSync(file, 'utf8'), data);
            fs.outputFileSync(file, rendered);
          } catch (e) {
            console.error(`Error parsing nunjucks file ${file}: `);
            return reject(e);
          }
        })
        .on('error', (er: any, entry: string) => {
          reject(er + ' on entry ' + entry);
        })
        .on('end', () => {
          resolve();
        });
    });
  }
}
