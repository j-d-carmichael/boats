const Bundler = require('./es5/Bundler.js')

const bundler = new Bundler({
  input: './srcOA3/index.yml',
  customVars: {
    host: 'http://www.somehost.com'
  }
})

bundler
  .toYamlFile('./build/builtOA3.yml')
  .then(() => {

    bundler.toYamlFile()
      .then(() => {

        console.log('Building json')
        bundler.toJsonFile('./build/builtOA3.json')
          .then(() => {
            bundler.toJsonFile()
          }).catch(e => console.error(e))
      }).catch(e => console.error(e))
  }).catch(e => console.error(e))
