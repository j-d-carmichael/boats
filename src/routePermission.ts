import path from 'path';
import UniqueOperationIds from '@/UniqueOperationIds';
import { BoatsRC, JSON } from '@/interfaces/BoatsRc';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(path.join(process.cwd(), 'package.json'));

export default (boatsrc: BoatsRC, filePath: string, stripValue: string, prefix = '', tail = '', removeMethod: boolean): string => {
  const permissionConfig = boatsrc && boatsrc.permissionConfig || {};
  const methodAlias = permissionConfig.methodAlias || {};
  const prefixConfig: JSON = Object.assign(
    {
      get: 'read',
      post: 'create',
      put: 'update',
      patch: 'update',
      delete: 'delete',
    },
    methodAlias
  );
  const mainPrefixes = [];
  const usePackageName = typeof permissionConfig.globalPrefix === 'undefined' || permissionConfig.globalPrefix === true;
  if (usePackageName) {
    mainPrefixes.push(packageJson.name);
  } else if (typeof permissionConfig.globalPrefix === 'string') {
    mainPrefixes.push(permissionConfig.globalPrefix);
  }
  if (prefix !== '') {
    mainPrefixes.push(prefix);
  }
  const method = path.basename(filePath).replace(/\..*/, '').toLowerCase();
  const calculatedPrefix = prefixConfig[method] || method;
  mainPrefixes.push(calculatedPrefix);
  return UniqueOperationIds.getUniqueOperationIdFromPath(
    filePath,
    stripValue,
    tail,
    undefined,
    removeMethod,
    boatsrc?.permissionConfig?.permissionStyle,
    boatsrc?.permissionConfig?.permissionSegmentStyle,
    mainPrefixes
  );
}
