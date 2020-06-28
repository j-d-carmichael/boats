import ucFirst from '@/ucFirst'

export default function (): string {
  const base = (this.env.globals.currentFilePointer.replace(this.env.globals.uniqueOpIdStripValue, '')).split('/');
  switch(base.length){
    case 1:
      return base[0].split('.').shift();
    default:
      return ucFirst(base[0]);
  }
}
