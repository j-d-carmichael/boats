import ucFirst from '@/ucFirst';

export default function (): string {
  const base = this.env.globals.currentFilePointer.replace(this.env.globals.uniqueOpIdStripValue, '').split('/');
  let tag;
  switch (base.length) {
    case 1:
      // a file sitting directly in the strip-value root: drop the file extension
      tag = ucFirst(base[0].split('.').shift());
      break;
    default:
      tag = ucFirst(base[0]);
  }
  return tag.replace('{', '').replace('}', '');
}
