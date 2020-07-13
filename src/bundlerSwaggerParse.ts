import path from 'path'
import YAML from 'js-yaml'
import fs from 'fs-extra'
import getOutputName from '@/getOutputName'
import validate from '@/validate'
import UniqueOperationIds from '@/UniqueOperationIds'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const $RefParser = require('json-schema-ref-parser')

/**
 * Bundles many files together and returns the final output path
 * @param inputFile
 * @param outputFile
 * @param options
 * @param indentation
 * @param excludeVersion
 * @param dereference
 * @returns {Promise<string>}
 */
export default async (inputFile: string, outputFile: string, options = {}, indentation = 2, excludeVersion: boolean, dereference: boolean): Promise<string> => {
  let bundled
  try {
    bundled = await $RefParser.bundle(inputFile, options)
    if (dereference) {
      bundled = await $RefParser.dereference(bundled)
    }
    UniqueOperationIds.checkOpIdsAreAllUnique(bundled)
    await validate.decideThenvalidate(bundled)

    let contents
    if (path.extname(outputFile) === '.json') {
      contents = JSON.stringify(bundled, null, indentation)
    } else {
      contents = YAML.safeDump(bundled, {
        indent: indentation
      })
    }
    fs.ensureDirSync(path.dirname(outputFile))
    const pathToWriteTo = getOutputName(
      outputFile,
      bundled,
      excludeVersion
    )
    fs.writeFileSync(
      pathToWriteTo,
      contents
    )
    return pathToWriteTo
  } catch (e) {
    console.error(JSON.stringify(bundled, undefined, 2))
    throw e;
  }
}
