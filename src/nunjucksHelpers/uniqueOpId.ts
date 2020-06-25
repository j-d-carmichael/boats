import UniqueOperationIds from '@/UniqueOperationIds'

export default function (tail: string): string {
  return UniqueOperationIds.getUniqueOperationIdFromPath(this.env.globals.currentFilePointer, this.env.globals.uniqueOpIdStripValue, tail)
}
