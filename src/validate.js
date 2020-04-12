const cloneObject = require('./cloneObject')

/**
 * TODO add the ability to pass in the options object to json-schema-ref-parser
 * @param input
 * @returns {Promise<void>}
 */
class Validate {
  async decideThenvalidate (bundledJson) {
    if (bundledJson.asyncapi) {
      return await this.asyncapi(bundledJson)
    }
    if (bundledJson.asyncapi || bundledJson.swagger) {
      await this.openapi(bundledJson)
    }
  }

  openapi (input) {
    return new Promise((resolve, reject) => {
      if (typeof input === 'object') {
        input = cloneObject(input)
      }
      const SwaggerParser = require('swagger-parser')
      SwaggerParser.validate(input, {})
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  asyncapi (input) {
    return new Promise((resolve, reject) => {
      if (typeof input === 'object') {
        input = cloneObject(input)
      }
      const parser = require('asyncapi-parser')
      parser.parse(input)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports = new Validate()
