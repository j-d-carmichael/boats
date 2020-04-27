const { readdirSync } = require('fs')
const path = require('path')
const YAML = require('js-yaml')
const _ = require('lodash')
const ucFirst = require('./ucFirst')
const removeFileExtension = require('./removeFileExtension')

class AutoIndexer {
  getFiles (dir) {
    const dirents = readdirSync(dir, { withFileTypes: true })
    const files = dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name)
      return dirent.isDirectory() ? this.getFiles(res) : res
    })
    return Array.prototype.concat(...files)
  }

  cleanFilePaths (dir, filePaths, indexFile) {
    return filePaths
      .map((filePath) => {
        return filePath !== indexFile && filePath.replace(dir, '')
      })
  }

  getMethodFromFileName (fileName) {
    return (fileName.split('.'))[0]
  }

  buildPathsYamlString (cleanPaths, channels, components, paths, remove) {
    let indexObject = {}
    cleanPaths.forEach((cleanPath) => {
      if (cleanPath) {
        const dir = path.dirname(cleanPath)
        const filename = path.basename(cleanPath)
        const method = this.getMethodFromFileName(filename)
        if (paths) {
          indexObject[dir] = indexObject[dir] || {}
          indexObject[dir][method] = {
            $ref: `.${cleanPath}`
          }
        }
        if (channels) {
          indexObject[removeFileExtension(cleanPath)] = {
            $ref: `.${cleanPath}`
          }
        }
        if (components) {
          remove = remove || ''
          indexObject[ucFirst(_.camelCase(removeFileExtension(cleanPath))).replace(remove, '')] = {
            $ref: `.${cleanPath}`
          }
        }
      }
    })
    return YAML.safeDump(indexObject, 2)
  }

  getIndexYaml (indexFile, options) {
    const absolutInexFilePath = path.join(process.cwd(), indexFile)
    const dir = path.join(process.cwd(), path.dirname(indexFile))
    const files = this.getFiles(dir)
    const cleanPaths = this.cleanFilePaths(dir, files, absolutInexFilePath, options)
    return this.buildPathsYamlString(
      cleanPaths,
      options.channels,
      options.components,
      options.paths,
      options.remove
    )
  }
}

module.exports = new AutoIndexer()
