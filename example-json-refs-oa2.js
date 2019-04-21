const path = require('path')
const boats = require('./index')
const bundler = new boats.Bundler({
  input: './srcJsonRefsOA2/index.yml',
  variables: {
    host: 'http://www.somehost.com'
  },
  boatsrc: path.join(process.cwd(), '.boatsrc')
})

bundler.toJsonFile('./build/builtJsonRefsOA2.json').catch(e => console.error(e))
