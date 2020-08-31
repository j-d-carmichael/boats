import stripFromEndOfString from '@/stripFromEndOfString';

export default (filePath: string): string => {
  filePath = stripFromEndOfString(filePath, '.njk');
  filePath = stripFromEndOfString(filePath, '.yml');
  return filePath;
};
