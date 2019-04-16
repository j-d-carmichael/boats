import cloneObject from './cloneObject'

/**
 * TODO add the ability to pass in the options object to json-schema-ref-parser
 * @param input
 * @returns {Promise<void>}
 */
export default async (input) => {
  if(typeof input === 'object'){
    input = cloneObject(input)
  }
  const SwaggerParser = require('swagger-parser')
  return await SwaggerParser.validate(input, {})
}
