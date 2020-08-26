import path from 'path';
import _ from 'lodash';
import ucFirst from '@/ucFirst';
import UniqueOperationIds from '@/UniqueOperationIds';
import { BoatsRC, JSON } from '@/interfaces/generic';

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
  const opId = UniqueOperationIds.getUniqueOperationIdFromPath(filePath, stripValue, tail, undefined, removeMethod);
  const method = path.basename(filePath).replace(/\..*/, '').toLowerCase();
  const calculatedPrefix = prefixConfig[method] || method;
  if (prefix === '') {
    return `${calculatedPrefix}${ucFirst(opId)}`;
  }
  return _.camelCase(prefix) + ucFirst(`${calculatedPrefix}${ucFirst(opId)}`);
}
