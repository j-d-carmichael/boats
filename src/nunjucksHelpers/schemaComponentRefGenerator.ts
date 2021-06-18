import schemaRefGenerator from '../schemaRefGenerator';

export default function (fileName: string): string {
  return schemaRefGenerator(this.env.globals.currentFilePointer, fileName, {
    componentsPath: 'components/schemas',
  });
}
