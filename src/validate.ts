import cloneObject from '@/cloneObject';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';
import { Parser } from '@asyncapi/parser';
import { BoatsRC } from '@/interfaces/BoatsRc';
import generatePermissionsSchema from '@/generatePermissionsSchema';
import { JsonSchema } from '@/interfaces/JsonSchema';

class Validate {
  async decideThenValidate (bundledJson: JsonSchema, boatsRc: BoatsRC) {
    bundledJson = generatePermissionsSchema(
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

  openapi (input: JsonSchema) {
    return new Promise((resolve, reject) => {
      if (typeof input === 'object') {
        input = cloneObject(input);
      }
      SwaggerParser.validate((input as unknown) as OpenAPI.Document, {})
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  asyncapi (input: string) {
    return new Promise((resolve, reject) => {
      const parser = new Parser();
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
