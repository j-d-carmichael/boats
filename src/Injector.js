class Injector {
  init (inputObject) {
    if (!global.boatsInject) {
      return inputObject
    }
    for (let key in global.boatsInject) {
      const injection = global.boatsInject[key]
      if (injection.toAllOperations) {
        inputObject = this.toAllOperations(inputObject, injection.toAllOperations)
      }
    }
    return inputObject
  }

  toAllOperations (inputObject, injection) {
    if (inputObject.paths) {
      inputObject = this.toAllOperationsPaths(inputObject, injection)
    }
    if (inputObject.channels) {
      inputObject = this.toAllOperationsChannels(inputObject, injection)
    }
    return inputObject
  }

  toAllOperationsChannels (inputObject, injection) {
    const excludeOps = injection.exclude || []
    for (let channel in inputObject.channels) {
      if (excludeOps.indexOf(channel) !== -1) {
        continue
      }
      for (let attribute in injection.content) {
        const attributeValue = injection.content[attribute]
        if (inputObject.channels[channel][attribute]) {
          const pathAttribute = inputObject.channels[channel][attribute]
          if (typeof pathAttribute === 'object') {
            if (Array.isArray(pathAttribute)) {
              inputObject.channels[channel][attribute] = inputObject.channels[channel][attribute].concat(attributeValue)
            } else {
              inputObject.channels[channel][attribute] = Object.assign(pathAttribute, attributeValue)
            }
          }
        } else {
          inputObject.channels[channel][attribute] = attributeValue
        }
      }
    }
    return inputObject
  }

  toAllOperationsPaths (inputObject, injection) {
    const excludeOps = injection.excludePaths || []
    const includeMethods = injection.includeMethods.map(m => m.toLowerCase()) || false
    for (let path in inputObject.paths) {
      if (excludeOps.indexOf(path) !== -1) {
        continue
      }

      for (let method in inputObject.paths[path]) {
        method = method.toLowerCase()
        if (includeMethods && includeMethods.indexOf(method) === -1) {
          continue
        }
        for (let attribute in injection.content) {
          const attributeValue = injection.content[attribute]
          if (inputObject.paths[path][method][attribute]) {
            const pathAttribute = inputObject.paths[path][method][attribute]
            if (typeof pathAttribute === 'object') {
              if (Array.isArray(pathAttribute)) {
                inputObject.paths[path][method][attribute] = inputObject.paths[path][method][attribute].concat(attributeValue)
              } else {
                inputObject.paths[path][method][attribute] = Object.assign(pathAttribute, attributeValue)
              }
            }
          } else {
            inputObject.paths[path][method][attribute] = attributeValue
          }
        }
      }
    }
    return inputObject
  }
}

module.exports = new Injector()
