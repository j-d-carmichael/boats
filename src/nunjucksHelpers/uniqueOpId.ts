import UniqueOperationIds, { GetUniqueOperationIdFromPath } from '@/UniqueOperationIds';

export default function (tailOrFullConfig: string | GetUniqueOperationIdFromPath): string {
  const base = {
    filePath: this.env.globals.currentFilePointer,
    stripValue: this.env.globals.uniqueOpIdStripValue
  };

  if(!tailOrFullConfig){
    return UniqueOperationIds.getUniqueOperationIdFromPath(base);
  }

  const input: GetUniqueOperationIdFromPath = typeof tailOrFullConfig === 'string' ?
    {
      ...base,
      tails: tailOrFullConfig
    } :
    {
      ...base,
      ...tailOrFullConfig
    };

  return UniqueOperationIds.getUniqueOperationIdFromPath(input);
}
