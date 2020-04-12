const path = require('path');
const YAML = require('js-yaml');
const fs = require('fs-extra');
const getFilePath = require('./getOutputName');
const validate = require('./validate');
const Injector = require('./Injector');
const $RefParser = require('json-schema-ref-parser');

/**
 * Bundles many files together and returns the final output path
 * @param inputFile
 * @param outputFile
 * @param options
 * @param indentation
 * @param excludeVersion
 * @param dereference
 * @param doValidation
 * @returns {Promise<string>}
 */
module.exports = async (inputFile, outputFile, options = {}, indentation = 2, excludeVersion, dereference, doValidation) => {
  let bundled;
  try {
    console.log(inputFile);
    bundled = await $RefParser.bundle(inputFile, options);
  } catch (e) {
    console.log('>>>>', e);
  }
  if (dereference) {
    bundled = await $RefParser.dereference(bundled);
  }
  bundled = Injector.init(bundled)
  if(doValidation === 'on'){
    await validate.decideThenvalidate(bundled)
  }
  let contents;
  if (path.extname(outputFile) === '.json') {
    contents = JSON.stringify(bundled, null, indentation);
  } else {
    contents = YAML.safeDump(bundled, indentation);
  }
  fs.ensureDirSync(path.dirname(outputFile));
  const pathToWriteTo = getFilePath(
    outputFile,
    bundled,
    excludeVersion
  );
  fs.writeFileSync(
    pathToWriteTo,
    contents
  );
  return pathToWriteTo;
};
