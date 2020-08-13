import cloneObject from '@/cloneObject';
import { validate } from 'swagger-parser';
import { OpenAPI } from 'openapi-types';

import parser from '@asyncapi/parser';

class Validate {
  async decideThenvalidate (bundledJson: Record<string, unknown>) {
    if (bundledJson.asyncapi) {
      return this.asyncapi(JSON.stringify(bundledJson));
    }
    if (bundledJson.asyncapi || bundledJson.swagger) {
      return this.openapi(bundledJson);
    }
  }

  openapi (input: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      if (typeof input === 'object') {
        input = cloneObject(input);
      }
      validate(input as unknown as OpenAPI.Document, {})
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
      parser.parse(input)
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
