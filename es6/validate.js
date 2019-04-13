import cloneObject from './cloneObject'

export default async (input, options = {}) => {
  if(typeof input === 'object'){
    input = cloneObject(input)
  }
  const SwaggerParser = require('swagger-parser')
  return await SwaggerParser.validate(input, {})
}
