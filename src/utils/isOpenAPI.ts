import { JsonSchema } from '@/interfaces/JsonSchema';

export default (bundledJson: JsonSchema) => {
  return bundledJson.openapi || bundledJson.swagger;
}
