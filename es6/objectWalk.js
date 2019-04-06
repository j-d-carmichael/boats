const dd = require('../dd')
export default (object, applyFunction) => {
  const walk = (object, applyFunction) => {
    if (typeof object === 'object') {
      for (let key in object) {
        if (typeof object[key] === 'object') {
          object[key] = walk(object[key], applyFunction)
        } else {
          object[key] = applyFunction(object[key])
        }
      }
      return object
    } else {
      // handle error
      dd('Non object passed to objectWalk')
    }
  }
  return walk(object, applyFunction)
}
