import ucFirst from '@/ucFirst';

export default function (): string {
  const base = this.env.globals.currentFilePointer.replace(this.env.globals.uniqueOpIdStripValue, '').split('/');
  let tag;
  switch (base.length) {
    case 1:
      tag = base[0].split('.').shift();
    default:
      tag = ucFirst(base[0]);
  }
  return tag.replace('{', '').replace('}', '');
}
