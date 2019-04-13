const json = require('../build/builtJsonRefsOA2_1.1.1.json')

describe('Read to JSON', () => {
  it('It should be version 1.1.1', async () => {
    expect(json.info.version).toBe('1.1.1')
  })

  it('Should have 2 paths', async () => {
    expect(Object.keys(json.paths).length).toBe(3)
  })

  it('"/weather/{country}" should have a single get method', async (done) => {
    const pathMethods = Object.keys(json.paths["/weather/{country}"])
    if(pathMethods.length === 1){
      if( pathMethods[0] === 'get' ){
        done()
      } else {
        done('The route "/weather/{country}" should only have a single method get. "' + pathMethods[0] + '" found instead.')
      }
    } else {
      done('"/temperature/" route expects precisely 1 method')
    }
  })

  it('"/temperature/" should have 2 methods build by the allOf keyword', async (done) => {
    const pathMethods = Object.keys(json.paths["/temperature/"])
    if(pathMethods.length === 2){
      if( pathMethods[0] === 'get' && pathMethods[1] === 'post' ){
        done()
      } else {
        done('The route "/temperature/" should only have a get and post method. Found: ' + JSON.stringify(pathMethods, null, 4))
      }
    } else {
      done('"/temperature/" route expects precisely 2 methods')
    }
  })
})
