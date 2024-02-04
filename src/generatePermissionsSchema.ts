import { JsonSchema } from '@/interfaces/JsonSchema';

const generatePermissionsSchema = (
  bundledJson: any,
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
    console.info(
      `INFO: Schema named "${generateSchemaNamed}" already exists, overwriting this with the generated permissions schema.`
    );
  }

  schemasRef[generateSchemaNamed] = {
    type: 'string',
    enum: allPermissions
  };

  return bundledJson;
}

export default generatePermissionsSchema;
