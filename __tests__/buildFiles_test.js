import fs from 'fs-extra'

describe('Check to ensure the files are generated with the correct file names:', () => {
  const paths = [
    'build/builtJsonRefsOA2_1.1.1.json',
    'build/builtJsonRefsOA3_1.0.0.json',
    'build/builtOA3_1.0.0.yml',
    'build/builtOA3.yml'
  ]
  for(let i = 0 ; i < paths.length ; ++i){
    it(paths[i], (done) => {
      const filePath = paths[i]
      if( fs.pathExistsSync(filePath) ) {
        return done()
      }
      return done('Not found filePath: ' + filePath)
    })
  }
})
