const Bundler = require('./es5/Bundler.js')

const bundler = new Bundler({
  input: './srcJsonRefsOA3/index.yml',
  variables: {
    host: 'http://www.somehost.com'
  }
})

bundler
  .toYamlFile('./build/builtJsonRefsOA3.yml')
  .then(() => {

    bundler.toYamlFile()
      .then(() => {

        console.log('Building json')
        bundler.toJsonFile('./build/builtJsonRefsOA3.json')
          .then(() => {
            bundler.toJsonFile()
          }).catch(e => console.error(e))
      }).catch(e => console.error(e))
  }).catch(e => console.error(e))
