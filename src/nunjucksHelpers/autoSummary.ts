import autoSummary from '@/autoSummary';

export default function (): string {
  const filePath = this.env.globals.currentFilePointer.replace(
    this.env.globals.uniqueOpIdStripValue,
    ''
  );
  return autoSummary(filePath);
}
