import upath from 'upath';
import YAML from 'js-yaml';
import fs from 'fs-extra';
import getOutputName from '@/getOutputName';
import validate from '@/validate';
import { BoatsRC } from '@/interfaces/BoatsRc';
import $RefParser from '@apidevtools/json-schema-ref-parser';

interface Input {
  inputFile: string,
  outputFile: string,
  boatsRc: BoatsRC,
  indentation: number,
  doNotValidate: boolean,
  excludeVersion: boolean,
  dereference: boolean
}

/**
 * Bundles many files together and returns the final output path
 */
export default async (input: Input): Promise<string> => {
  const { excludeVersion, dereference, inputFile, outputFile, boatsRc } = input;
  const doNotValidate = input.doNotValidate || false;
  const indentation = input.indentation || 2;

  let bundled;
  try {
    bundled = await $RefParser.bundle(inputFile, boatsRc.jsonSchemaRefParserBundleOpts);
    if (dereference) {
      bundled = await $RefParser.dereference(bundled);
    }

    if (doNotValidate) {
      console.warn('Bypassing validation as dontValidateOutput flag seen')
    } else {
      await validate.decideThenValidate(
        bundled as any,
        boatsRc
      );
    }

    let contents;
    if (upath.extname(outputFile) === '.json') {
      contents = JSON.stringify(bundled, null, indentation);
    } else {
      contents = YAML.dump(bundled, {
        indent: indentation
      });
    }
    fs.ensureDirSync(upath.dirname(outputFile));
    const pathToWriteTo = getOutputName(outputFile, bundled, excludeVersion);
    fs.writeFileSync(pathToWriteTo, contents);
    return pathToWriteTo;
  } catch (e) {
    console.error(JSON.stringify(bundled, undefined, 2));
    throw e;
  }
};
