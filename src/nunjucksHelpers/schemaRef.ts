import schemaRefGenerator from '../schemaRefGenerator';

export default function (fileName: string, componentsPath = 'components/schemas'): string {
  return schemaRefGenerator(this.env.globals.currentFilePointer, fileName, {
    componentsPath,
  }, this.env.globals.boatsConfig);
}
