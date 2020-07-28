import path from 'path'
import ucFirst from '@/ucFirst'
import UniqueOperationIds from '@/UniqueOperationIds'
import { JSON, BoatsRC } from '@/interfaces/generic';

export default (boatsrc: BoatsRC, filePath: string, stripValue: string, tail: string): string => {
  const permissionConfig = boatsrc && boatsrc.permissionConfig && boatsrc.permissionConfig.routePrefix
  const prefixConfig: JSON = Object.assign(
    {
      get: 'read',
      post: 'create',
      put: 'update',
      patch: 'update',
      delete: 'delete',
    },
    permissionConfig
  )
  const opId = UniqueOperationIds.getUniqueOperationIdFromPath(filePath, stripValue, tail)
  const method = path.basename(filePath).replace(/\..*/, '').toLowerCase()
  const prefix = prefixConfig[method] || method

  return `${prefix}${ucFirst(opId)}`
}
