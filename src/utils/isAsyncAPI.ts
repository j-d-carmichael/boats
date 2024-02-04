import { JsonSchema } from '@/interfaces/JsonSchema';

export default (bundledJson: JsonSchema) => {
  return bundledJson.asyncapi;
}
