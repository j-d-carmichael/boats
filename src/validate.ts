import cloneObject from '@/cloneObject';
import { validate } from 'swagger-parser';
import { OpenAPI } from 'openapi-types';
import parser from '@asyncapi/parser';
import { BoatsRC } from '@/interfaces/BoatsRc';

export type JsonSchema = {
  [key: string]: unknown;
  components?: {
    schemas?: Record<string, unknown>
  }
};

class Validate {
  generatePermissionsSchema(
    bundledJson: JsonSchema,
    generateSchemaNamed?: string
  ): JsonSchema {
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
    bundledJson.components.schemas[generateSchemaNamed] = {
      type: 'string',
      enum: allPermissions
    };

    return bundledJson;
  }

  async decideThenValidate(bundledJson: JsonSchema, boatsRc: BoatsRC) {
    bundledJson = this.generatePermissionsSchema(
      bundledJson,
      boatsRc.permissionConfig?.generateSchemaNamed
    );

    if (bundledJson.asyncapi) {
      return this.asyncapi(JSON.stringify(bundledJson));
    }
    if (bundledJson.openapi || bundledJson.swagger) {
      return this.openapi(bundledJson);
    }
  }

  openapi(input: JsonSchema) {
    return new Promise((resolve, reject) => {
      if (typeof input === 'object') {
        input = cloneObject(input);
      }
      validate((input as unknown) as OpenAPI.Document, {})
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  asyncapi(input: string) {
    return new Promise((resolve, reject) => {
      parser
        .parse(input)
        .then((data: any) => {
          resolve(data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}

export default new Validate();
