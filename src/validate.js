const cloneObject = require('./cloneObject')

/**
 * TODO add the ability to pass in the options object to json-schema-ref-parser
 * @param input
 * @returns {Promise<void>}
 */
module.exports = async (input) => {
  if(typeof input === 'object'){
    input = cloneObject(input)
  }
  const SwaggerParser = require('swagger-parser')
  try{
    await SwaggerParser.validate(input, {})
  } catch (e) {
    console.log(e.stack)
  }
}
