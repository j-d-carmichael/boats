import cloneObject from '@/cloneObject';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';
import { Parser } from '@asyncapi/parser';
import { JsonSchema } from '@/interfaces/JsonSchema';

class Validate {
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
