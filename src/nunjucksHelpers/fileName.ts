import removeFileExtension from '@/removeFileExtension';

export default function (withFileExt: boolean): string {
  const base = this.env.globals.currentFilePointer.split('/').pop();
  if (withFileExt) {
    return base;
  }
  return removeFileExtension(base);
}
