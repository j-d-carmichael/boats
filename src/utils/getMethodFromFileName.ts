export default function getMethodFromFileName (fileName: string): string {
  return fileName.split('.')[0].toLowerCase();
}
