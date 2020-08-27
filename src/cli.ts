import bundlerSwaggerParse from '@/bundlerSwaggerParse';
import commander from '@/commander';
import convertToNunjucksOrYaml from '@/convertToNunjucksOrYaml';
import getBundlerOptions from '@/getBundlerOptions';
import Template from '@/Template';
import fs from 'fs-extra';
import checkVersion from 'npm-tool-version-check';
import path from 'path';
import packageJson from '../package.json';
import 'colors';

const dotenvFilePath = path.join(process.cwd(), '.env');
const boatsrc = path.join(process.cwd(), '.boatsrc');
const remoteBoatsPackageJson = 'https://raw.githubusercontent.com/johndcarmichael/boats/master/package.json';

// If a .env file exists call dotenv package to set into the env vars
if (fs.pathExistsSync(dotenvFilePath)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: dotenvFilePath });
}

const parseCli = async () => {
  const program = commander(process.argv);

  if (!program.yes && process.env.NODE_ENV !== 'test') {
    await checkVersion(packageJson.version, remoteBoatsPackageJson, 'BOATS').catch(catchHandle);
  }

  if (program.convert_to_njk) {
    // Convert files to njk
    convertToNunjucksOrYaml(program.convert_to_njk, 'njk');
  } else if (program.convert_to_yml) {
    // Convert files to yaml
    convertToNunjucksOrYaml(program.convert_to_yml, 'yml');
  } else if (program.init) {
    // Return init function
    require('./init');
  } else {
    // parse the directory then validate and bundle with swagger-parser
    const returnFile = await Template.directoryParse(
      program.input,
      program.output,
      program.indentation,
      program.strip_value,
      program.variables,
      program.functions,
      boatsrc
    );

    const pathWrittenTo = await bundlerSwaggerParse(
      returnFile,
      program.output,
      getBundlerOptions(boatsrc),
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
