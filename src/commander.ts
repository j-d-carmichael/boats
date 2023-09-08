import { createCommand } from 'commander';
import collect from '@/commander.collect';
import helperFunctions from '@/commander.helperFunctions';

/**
 * This project has been alive for a while - please only add new commands
 * in kebab-case and ensure the command is added alphabetically following
 * the convention set below. Thanks.
 */
export default (args: any[]): any => {
  const commander = createCommand();
  commander.option('-$, --variables [value]', 'Array of variables to pass to the templates, eg "-$ host=http://somehost.com -$ apikey=321654987"', collect, []);
  commander.option('--convert_to_njk <localDirectory>', 'Convert to .yml.njk, pass in a relative src folder eg: --convert_to_njk ./src');
  commander.option('--convert_to_yml <localDirectory>', 'Converted to .yml.njk syntax but want to revert: --convert_to_yml ./src');
  commander.option('--dontValidateOutput', 'When passed, the compiled file will not be validated');
  commander.option('-d, --dereference', 'Will pass the output via https://apitools.dev/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback');
  commander.option('-i, --input [path]', 'The relative path to the main input file eg "./src/index.yml"');
  commander.option('-f, --functions [filepath]', 'Array of helper function relative paths, eg "-f ./helperOne.js -f ./helperTwo -f ./helperThree.ts"', helperFunctions, []);
  commander.option('--init', 'Inject a skeleton yml structure to the current directory named /src/...');
  commander.option('-I, --injectSnippet <snippet>', 'Eg "boats -I oa2/crud -R ./src/paths -N user" or "boats -I https://github/some/snippet.git -R ./src/paths -N user"');
  commander.option('-n --noVersionCheck', 'Will completely bypass the version check');
  commander.option('-N, --targetName <snippet>', 'Eg boats -I oa2/crud -R ./src/paths -N user');
  commander.option('-o, --output [path]', 'The relative path to the main output file eg "./built/bundled.yml');
  commander.option('-R, --relativeTargetPath <snippet>', 'Eg boats -I oa2/crud -R ./src/paths -N user');
  commander.option('-s, --strip_value <strip>', 'The value removed from the file path to create the uniqueOpId, it not provided will be either src/paths/ or src/channels/ based on api type.', false);
  commander.option('-S, --subSnippetPath <snippet>', 'The subdir in the target to extract eg "boats -I https://github/some/snippet.git -S oa2/crud -R ./src/paths -N user"');
  commander.option('-x, --exclude_version', 'By default the OA version is injected into the file name, this option stops this happening.');
  commander.option('-y, --yes', 'Assumes yes to any questions prompted by the tool (skip version check).');

  commander.parse(args);
  return commander.opts();
};
