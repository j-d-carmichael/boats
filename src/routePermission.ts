import upath from 'upath';
import UniqueOperationIds from '@/UniqueOperationIds';
import { BoatsRC, JSON } from '@/interfaces/BoatsRc';
import { MethodAliasPosition } from '@/enums/MethodAliasPosition';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(upath.join(process.cwd(), 'package.json'));

const defaultPrefix = {
  get: 'read',
  post: 'create',
  put: 'update',
  patch: 'update',
  delete: 'delete'
};

export default (
  boatsrc: BoatsRC,
  filePath: string,
  stripValue: string,
  prefix = '',
  tail = '',
  removeMethod: boolean
): string => {
  const permissionConfig = (boatsrc && boatsrc.permissionConfig) || {};
  const methodAlias = permissionConfig.methodAlias || {};
  const prefixConfig: JSON = Object.assign(defaultPrefix, methodAlias);
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
  const method = upath.basename(filePath).replace(/\..*/, '').toLowerCase();
  const calculatedPrefix = prefixConfig[method] || method;
  const tails = [];
  if (tail) {
    tails.push(tail);
  }
  if (boatsrc?.permissionConfig?.methodAliasPosition === MethodAliasPosition.EndOfPermissionString) {
    tails.push(calculatedPrefix);
  } else {
    mainPrefixes.push(calculatedPrefix);
  }
  return UniqueOperationIds.getUniqueOperationIdFromPath({
    filePath,
    stripValue,
    tails,
    removeMethod,
    style: boatsrc?.permissionConfig?.permissionStyle,
    segmentStyle: boatsrc?.permissionConfig?.permissionSegmentStyle,
    prefixes: mainPrefixes
  });
};
