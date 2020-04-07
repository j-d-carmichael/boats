const walker = require('walker')
const fs = require('fs-extra')
const files = []
walker('./src')
  .on('file', async (file) => {
    files.push(file)
  })
  .on('end', () => {
    files.forEach((file) => {
      fs.moveSync(file, file + '.njk')
    })
  })
