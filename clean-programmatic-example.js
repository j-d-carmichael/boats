const Bundler = require('./es5/Bundler.js')

const bundler = new Bundler({
  input: './srcOA3/index.yml',
  customVars: {
    host: 'http://www.somehost.com'
  }
})

// Writes the output to file
bundler.toYamlFile('./build/builtOA3.yml')
  .catch(e => console.error(e))

// Writes the output to the console
bundler.toYamlFile()
  .catch(e => console.error(e))
