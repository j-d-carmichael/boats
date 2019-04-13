const Bundler = require('./es5/Bundler.js')

const bundler = new Bundler({
  input: './srcJsonRefsOA2/index.yml',
  variables: {
    host: 'http://www.somehost.com'
  }
})

bundler.toJsonFile('./build/builtJsonRefsOA2.json').catch(e => console.error(e))
