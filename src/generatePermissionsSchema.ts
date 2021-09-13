import { JsonSchema } from '@/interfaces/JsonSchema';

class SchemaAlreadyExistsError extends Error {
  constructor(generateSchemaNamed: string) {
    super(
      `Schema named "${generateSchemaNamed}" already exists. `
      + 'Make sure to change "permissionConfig.generateSchemaNamed" to a schema name you are not already using.'
    );
  }
}

const generatePermissionsSchema = (
  bundledJson: JsonSchema,
  generateSchemaNamed?: string
): JsonSchema => {
  if (!bundledJson.paths || !generateSchemaNamed) {
    return bundledJson;
  }

  const isSwagger = !!bundledJson.swagger;
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

  if (isSwagger) {
    bundledJson.definitions = bundledJson.definitions || {};
  } else {
    bundledJson.components.schemas = bundledJson.components.schemas || {};
  }

  const schemasRef = isSwagger
    ? bundledJson.definitions
    : bundledJson.components.schemas;

  if (schemasRef[generateSchemaNamed]) {
    throw new SchemaAlreadyExistsError(generateSchemaNamed);
  }

  schemasRef[generateSchemaNamed] = {
    type: 'string',
    enum: allPermissions
  };

  return bundledJson;
}

export default generatePermissionsSchema;
