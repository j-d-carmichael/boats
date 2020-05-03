const path = require('path')
const hasha = require('hasha')
const fs = require('fs-extra')
jest.setTimeout(60 * 1000) // in milliseconds

describe('Check to ensure the files are generated with the correct file names:', () => {
  const paths = [
    ['build/builtOA2_readonly_1.0.1.yml', '5051492748b28a0a5cec1f0b16c3ba78'],
    ['build/builtOA2_std_1.0.1.yml', 'e13ba8f1d53390e36bf197d6df2e28ef'],
    ['build/builtOA3_1.0.1.yml', '3af08fac9d2500ca3ddf431adeece189'],
    ['build/builtOA3.yml', '3af08fac9d2500ca3ddf431adeece189'],
    ['build/srcASYNC2_1.0.1.yml', '9b32650df4bcf361a4f5fb355c7d77d8']
  ]
  it('Check all files have been created', (done) => {
    for (let i = 0; i < paths.length; ++i) {
      const filePath = paths[i][0]
      if (!fs.pathExistsSync(filePath)) {
        done('Not found filePath: ' + filePath)
      }
    }
    done()
  })

  it('Should have the correct file hashes', async (done) => {
    // If these tests fail the either:
    // A) The test_swagger.yml has changed
    // B) The tpl for the typescipt server has change
    // C) Something broke when building the said files
    const mismatched = []
    for (let i = 0; i < paths.length; ++i) {
      const filePath = paths[i][0]
      const fileHash = paths[i][1]
      const hash = await hasha.fromFile(path.join(process.cwd(), filePath), { algorithm: 'md5' })
      if (hash !== fileHash) {
        const wrong = `Hash mis-match for file ${filePath}. Expected hash ${fileHash} but got ${hash}`
        mismatched.push(wrong)
      }
    }
    if (mismatched.length > 0) {
      done(mismatched)
    } else {
      done()
    }
  })
})
