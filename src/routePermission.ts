import path from 'path';
import UniqueOperationIds from '@/UniqueOperationIds';
import { BoatsRC, JSON } from '@/interfaces/BoatsRc';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(path.join(process.cwd(), 'package.json'));

export default (boatsrc: BoatsRC, filePath: string, stripValue: string, prefix = '', tail = '', removeMethod: boolean): string => {
  const permissionConfig = boatsrc && boatsrc.permissionConfig && boatsrc.permissionConfig.routePrefix;
  const prefixConfig: JSON = Object.assign(
    {
      get: 'read',
      post: 'create',
      put: 'update',
      patch: 'update',
      delete: 'delete',
    },
    permissionConfig
  );
  const mainPrefixes = [];
  const usePackageJsonNameAsPrefix = typeof boatsrc.permissionConfig.usePackageJsonNameAsPrefix === 'undefined' ? true : boatsrc.permissionConfig.usePackageJsonNameAsPrefix;
  if (usePackageJsonNameAsPrefix) {
    mainPrefixes.push(packageJson.name);
  }
  if (prefix !== '') {
    mainPrefixes.push(packageJson.name);
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
    boatsrc.permissionConfig.permissionStyle,
    mainPrefixes
  );
}
