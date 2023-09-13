import autoSummary, { AutoSummaryOptions } from '@/autoSummary';

export default function (options: AutoSummaryOptions): string {
  const filePath = this.env.globals.currentFilePointer.replace(this.env.globals.uniqueOpIdStripValue, '');
  return autoSummary(filePath, options);
}
