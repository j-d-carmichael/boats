import AutoIndexer from '@/AutoIndexer';
import { AutoComponentIndexerOptions } from '@/interfaces/GetIndexYamlOptions';

export default function (autoComponentIndexerOptions: AutoComponentIndexerOptions): string {
  return AutoIndexer.getIndexYaml(
    this.env.globals.currentFilePointer,
    this.env.globals.boatsConfig,
    {
      components: true,
      autoComponentIndexerOptions
    }
  );
}
