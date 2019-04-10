const Bundler = require('./es5/Bundler.js')

const bundler = new Bundler({
  input: './srcOA2/index.yml',
  variables: {
    host: 'http://www.somehost.com'
  }
})

bundler
  .toYamlFile('./build/builtOA2.yml')
  .then(() => {

    bundler.toYamlFile()
      .then(() => {

        console.log('Building json')
        bundler.toJsonFile('./build/builtOA2.json')
          .then(() => {
            bundler.toJsonFile()
          }).catch(e => console.error(e))
      }).catch(e => console.error(e))
  }).catch(e => console.error(e))
