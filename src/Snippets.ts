import nunjucks, { renderString } from 'nunjucks';
import fs from 'fs-extra';
import path from 'path';

// No types found for walker
// eslint-disable-next-line @typescript-eslint/no-var-requires
const walker = require('walker');

interface ISnippets {
  snippetName: string,
  relativeTargetPath: string,
  targetName: string
}

export default class Snippets {
  constructor (input: ISnippets) {
    this.nunjucksSetup();
    const target = this.copySnippet(
      input.snippetName,
      input.relativeTargetPath,
      input.targetName
    );
    this.renderPlacedSnippet(target, input)
      .then(() => {
        console.log('Done');
      })
      .catch((e) => {
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
        commentEnd: '#~~',
      }
    });
  }

  copySnippet (
    snippetName: string,
    relativeTargetPath: string,
    targetName: string
  ): string {
    const targetPath = path.join(process.cwd(), relativeTargetPath, targetName);
    fs.ensureDirSync(targetPath);
    fs.copySync(
      path.join(__dirname, '../../snippets', snippetName),
      targetPath
    );
    return targetPath
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
