const path = require('path')
const Bundler = require('./es5/Bundler')
const program = require('./commander')()
const fs = require('fs-extra')
const dotenvFilePath = path.join(process.cwd(), '.env')

// If a .env file exists call dotenv package to set into the env vars
if(fs.pathExistsSync(dotenvFilePath)){
  console.log('Loading dotenv with file: ' + dotenvFilePath)
  require('dotenv').config({ path: dotenvFilePath })
}

// Return init function
if (program.init) {
  return require('./init')
}

// Start bundler
const calculateOutputFormat = () => {
  return program[(program.output) ? 'output' : 'input'].split('.').pop()
}
const bundler = new Bundler(program)
bundler[(['yaml', 'yml'].indexOf(calculateOutputFormat()) !== -1) ? 'toYamlFile' : 'toJsonFile'](program.output)
  .then(() => {
    // Nothing to do as all handled in the bundler
  }).catch((err) => {
  console.error(err)
})
