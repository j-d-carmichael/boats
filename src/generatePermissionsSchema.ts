import { JsonSchema } from '@/types';

const generatePermissionsSchema = (
  bundledJson: JsonSchema,
  generateSchemaNamed?: string
): JsonSchema => {
  if (!bundledJson.paths || !generateSchemaNamed) {
    return bundledJson;
  }

  const allPermissions: string[] = Object.values(bundledJson.paths)
    .map((method) => Object.values(method))
    .flat()
    .map((definition: { 'x-permission'?: string }) => (
      definition['x-permission'])
    )
    .filter((permissionName) => permissionName);

  if (!allPermissions.length) {
    return bundledJson;
  }

  bundledJson.components.schemas = bundledJson.components.schemas || {};

  if (bundledJson.components.schemas[generateSchemaNamed]) {
    throw new Error(
      `Schema named "${generateSchemaNamed}" already exists. `
      + 'Make sure to change "permissionConfig.generateSchemaNamed" to a schema name you are not already using.'
    );
  }

  bundledJson.components.schemas[generateSchemaNamed] = {
    type: 'string',
    enum: allPermissions
  };

  return bundledJson;
}

export default generatePermissionsSchema;
