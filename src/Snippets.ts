import nunjucks, { renderString } from 'nunjucks';
import fs from 'fs-extra';
import path from 'path';

// No types found for walker
// eslint-disable-next-line @typescript-eslint/no-var-requires
const walker = require('walker');

interface ISnippets {
  relativeTarget: string,
  snippet: string,
  targetName: string
}

class Snippets {
  constructor (input: ISnippets) {
    this.nunjucksSetup();
    const target = this.copySnippet(
      input.relativeTarget,
      input.snippet,
      input.targetName
    );
    this.renderPlacedSnippet(target);
  }

  nunjucksSetup () {
    nunjucks.configure({
      blockStart: '~~%',
      blockEnd: '%~~',
      variableStart: '~~$',
      variableEnd: '$~~',
      commentStart: '~~#',
      commentEnd: '#~~',
    });
  }

  copySnippet (
    relativeTarget: string,
    snippet: string,
    targetName: string
  ): void {
    const targetPath = path.join(process.cwd(), srcPath, targetName);
    fs.ensureDirSync(targetPath);
    fs.copySync(
      path.join(__dirname, '../../snippets', snippet),
      targetPath
    );
  }

  renderPlacedSnippet (targetPath, data) {
    return new Promise((resolve, reject) => {
      walker(targetPath)
        .on('file', (file: string) => {
          try {
            const rendered = renderString(fs.readFileSync(file, 'utf8'), file);
            fs.outputFileSync(outputFile, rendered);
          } catch (e) {
            console.error(`Error parsing nunjucks file ${file}: `);
            return reject(e);
          }
        })
        .on('error', (er: any, entry: string) => {
          reject(er + ' on entry ' + entry);
        })
        .on('end', () => {
          resolve(this.stripNjkExtension(returnFileinput));
        });
    });
  }
}

export default Snippets();
