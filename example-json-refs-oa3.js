const path = require('path')
const boats = require('./index')
const bundler = new boats.Bundler({
  input: './srcJsonRefsOA3/index.yml',
  variables: [{
    host: 'http://www.somehost.com'
  }],
  boatsrc: path.join(process.cwd(), '.boatsrc')
})

bundler.toJsonFile('./build/builtJsonRefsOA3.json').catch(e => console.error(e))
