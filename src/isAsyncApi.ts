import fs from 'fs-extra';

export default (inputPath: string): boolean => {
  const filestring = fs.readFileSync(inputPath, 'utf8');
  return filestring.includes('asyncapi:');
}
