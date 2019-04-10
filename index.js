const Bundler = require('./es5/Bundler')
const program = require('./commander')()

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
