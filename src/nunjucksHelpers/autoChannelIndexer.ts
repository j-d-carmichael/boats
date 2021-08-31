import AutoIndexer from '@/AutoIndexer';

export default function (): string {
  return AutoIndexer.getIndexYaml(this.env.globals.currentFilePointer, this.env.globals.boatsConfig, {
    channels: true,
  });
}
