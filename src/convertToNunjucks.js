const walker = require('walker')
const fs = require('fs-extra')
const path = require('path')
module.exports = (dir) => {
  dir = path.join(process.cwd(), dir)
  console.log('Converting: ' + dir)
  const files = []
  walker(dir)
    .on('file', async (file) => {
      files.push(file)
    })
    .on('end', () => {
      files.forEach((file) => {
        const newTarget = file + '.njk'
        fs.moveSync(file, newTarget)
        // read file to string and replace .yml with .yml.njk
        let string = fs.readFileSync(newTarget, { encoding: 'utf8' }).toString()
        const pattern = '.yml'
        const regex = new RegExp(pattern, 'g')
        string = string.replace(regex, '.yml.njk')
        fs.writeFileSync(newTarget, string, { encoding: 'utf8' })
      })
    })
}
