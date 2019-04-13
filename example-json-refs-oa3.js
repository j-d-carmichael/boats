const Bundler = require('./es5/Bundler.js')

const bundler = new Bundler({
  input: './srcJsonRefsOA3/index.yml',
  variables: {
    host: 'http://www.somehost.com'
  }
})

bundler.toJsonFile('./build/builtJsonRefsOA3.json').catch(e => console.error(e))
