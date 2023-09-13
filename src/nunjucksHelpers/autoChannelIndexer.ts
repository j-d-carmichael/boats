import AutoIndexer from '@/AutoIndexer';
import { AutoChannelIndexerOptions } from '@/interfaces/GetIndexYamlOptions';

export default function (options?: AutoChannelIndexerOptions): string {
  return AutoIndexer.getIndexYaml(this.env.globals.currentFilePointer, this.env.globals.boatsConfig, {
    channels: true,
    ...{
      autoChannelIndexerOptions: options
    }
  });
}
