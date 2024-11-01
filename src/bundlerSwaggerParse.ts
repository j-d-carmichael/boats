import upath from 'upath';
import YAML from 'js-yaml';
import fs from 'fs-extra';
import getOutputName from '@/getOutputName';
import validate from '@/validate';
import { BoatsRC } from '@/interfaces/BoatsRc';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import generatePermissionsSchema from '@/generatePermissionsSchema';
import isOpenAPI from '@/utils/isOpenAPI';
import SortAttributes from '@/SortAttributes';

/**
 * Bundles many files together and returns the final output path
 */
export default async (input: {
  inputFile: string,
  outputFile: string,
  boatsRc: BoatsRC,
  indentation: number,
  doNotValidate: boolean,
  excludeVersion: boolean,
  dereference: boolean
}): Promise<string> => {
  const { excludeVersion, dereference, inputFile, outputFile, boatsRc } = input;
  const doNotValidate = input.doNotValidate || false;
  const indentation = input.indentation || 2;

  let bundled;
  try {
    bundled = await $RefParser.bundle(inputFile, boatsRc.jsonSchemaRefParserBundleOpts);
    if (dereference) {
      // @ts-ignore
      bundled = await $RefParser.dereference(bundled);
    }
    bundled = generatePermissionsSchema(bundled, boatsRc.permissionConfig?.generateSchemaNamed);
    const thisIsOpenAPI = isOpenAPI(bundled);
    bundled = (thisIsOpenAPI) ? SortAttributes.forOpenAPI(bundled) : SortAttributes.forAsyncAPI(bundled);

    if (doNotValidate) {
      console.warn('Bypassing validation as dontValidateOutput flag seen');
    } else {
      thisIsOpenAPI ? await validate.openapi(bundled) : await validate.asyncapi(JSON.stringify(bundled));
    }

    let contents;
    if (upath.extname(outputFile) === '.json') {
      contents = JSON.stringify(bundled, null, indentation);
    } else {
      contents = YAML.dump(bundled, { indent: indentation, lineWidth: 1000 });
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
