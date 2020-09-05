import AutoIndexer from '@/AutoIndexer';
import { Remove } from '@/interfaces/GetIndexYamlOptions';

export default function (remove: Remove): string {
  return AutoIndexer.getIndexYaml(this.env.globals.currentFilePointer, {
    components: true,
    remove,
  });
}
