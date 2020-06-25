import cloneObject from '@/cloneObject'
import { validate } from 'swagger-parser'
import { OpenAPI } from 'openapi-types'

// There are no types for this package yet
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('@asyncapi/parser')

class Validate {
  async decideThenvalidate (bundledJson: Record<string, unknown>) {
    if (bundledJson.asyncapi) {
      return this.asyncapi(bundledJson)
    }
    if (bundledJson.asyncapi || bundledJson.swagger) {
      return this.openapi(bundledJson)
    }
  }

  openapi (input: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      if (typeof input === 'object') {
        input = cloneObject(input)
      }
      validate(input as unknown as OpenAPI.Document, {})
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  asyncapi (input: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      if (typeof input === 'object') {
        input = cloneObject(input)
      }

      parser.parse(input)
        .then((data: any) => {
          resolve(data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
}

export default new Validate()
