const path = require('path')
const packageJson = require(path.join(process.cwd(), 'package.json'))
module.exports = (attribute) => {
  if(typeof packageJson[attribute] === 'undefined'){
    throw new Error('Attribute not found in package.json file: ' + attribute)
  }
  return packageJson[attribute]
}
