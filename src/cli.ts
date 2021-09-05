import bundlerSwaggerParse from '@/bundlerSwaggerParse';
import commander from '@/commander';
import convertToNunjucksOrYaml from '@/convertToNunjucksOrYaml';
import Template from '@/Template';
import fs from 'fs-extra';
import checkVersion from 'npm-tool-version-check';
import upath from 'upath';
import packageJson from '../package.json';
import 'colors';
import GetCheckCorrectBoatsRc from '@/GetCheckCorrectBoatsRc';
import { BoatsRC } from '@/interfaces/BoatsRc';
import Snippets from '@/Snippets';
import { init } from './init';

const dotenvFilePath = upath.join(process.cwd(), '.env');
const boatsRc: BoatsRC = GetCheckCorrectBoatsRc.getBoatsConfig();
const remoteBoatsPackageJson = 'https://raw.githubusercontent.com/johndcarmichael/boats/master/package.json';

// If a .env file exists call dotenv package to set into the env vars
if (fs.pathExistsSync(dotenvFilePath)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: dotenvFilePath });
}

const parseCli = async () => {
  const program = commander(process.argv);

  if (program.yes) {
    process.env.npm_tool_version_check__quiet = 'true';
  }

  if (process.env.NODE_ENV !== 'test') {
    await checkVersion(packageJson.version, remoteBoatsPackageJson, 'BOATS').catch(catchHandle);
  }

  if (program.convert_to_njk) {
    // Convert files to njk
    convertToNunjucksOrYaml(program.convert_to_njk, 'njk');
  } else if (program.convert_to_yml) {
    // Convert files to yaml
    convertToNunjucksOrYaml(program.convert_to_yml, 'yml');
  } else if (program.injectSnippet) {
    // Snippets
    new Snippets(program);
  } else if (program.init) {
    // Return init function
    await init();
  } else {
    // parse the directory then validate and bundle with swagger-parser
    const returnFile = await Template.directoryParse(
      program.input,
      program.output,
      program.indentation,
      program.strip_value,
      program.variables,
      program.functions,
      boatsRc
    );

    const pathWrittenTo = await bundlerSwaggerParse(
      returnFile,
      program.output,
      boatsRc.jsonSchemaRefParserBundleOpts,
      program.indentation,
      program.exclude_version,
      program.dereference
    );
    console.log('Completed, the files were rendered, validated and bundled to: '.green + pathWrittenTo.green.bold);
  }
};

const catchHandle = (error: any) => {
  console.trace(error);
  process.exit(1);
};

parseCli().catch(catchHandle);
