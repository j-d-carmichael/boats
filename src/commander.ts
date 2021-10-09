import { createCommand } from 'commander';
import collect from '@/commander.collect';
import helperFunctions from '@/commander.helperFunctions';

// eslint-disable-next-line max-lines-per-function
export default (args: any[]): any => {
  const commander = createCommand();
  commander
    .option('--init', 'Inject a skeleton yml structure to the current directory named /src/...')
    .option('-i, --input [path]', 'The relative path to the main input file eg "./src/index.yml"')
    .option('-o, --output [path]', 'The relative path to the main output file eg "./built/bundled.yml')
    .option(
      '-$, --variables [value]',
      'Array of variables to pass to the templates, eg "-$ host=http://somehost.com -$ apikey=321654987"',
      collect,
      []
    )
    .option(
      '-f, --functions [filepath]',
      'Array of helper function relative paths, eg "-f ./helperOne.js -f ./helperTwo -f ./helperThree.ts"',
      helperFunctions,
      []
    )
    .option(
      '-d, --dereference',
      'Will pass the output via https://apitools.dev/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback'
    )
    .option(
      '-I, --injectSnippet <snippet>',
      'Eg "boats -I oa2/crud -R ./src/paths -N user" or "boats -I https://github/some/snippet.git -R ./src/paths -N user"'
    )
    .option(
      '-S, --subSnippetPath <snippet>',
      'The subdir in the target to extract eg "boats -I https://github/some/snippet.git -S oa2/crud -R ./src/paths -N user"'
    )
    .option(
      '-R, --relativeTargetPath <snippet>',
      'Eg boats -I oa2/crud -R ./src/paths -N user'
    )
    .option(
      '-N, --targetName <snippet>',
      'Eg boats -I oa2/crud -R ./src/paths -N user'
    )
    .option(
      '--skipValidation',
      'Completely bypass any validation, use with caution.'
    )
    .option(
      '-s, --strip_value <strip>',
      'The value removed from the file path to create the uniqueOpId, it not provided will be either src/paths/ or src/channels/ based on api type.',
      false
    )
    .option(
      '-x, --exclude_version',
      'By default the OA version is injected into the file name, this option stops this happening.'
    )
    .option(
      '--convert_to_njk <localDirectory>',
      'Convert to .yml.njk, pass in a relative src folder eg: --convert_to_njk ./src'
    )
    .option(
      '--convert_to_yml <localDirectory>',
      'Converted to .yml.njk syntax but want to revert: --convert_to_yml ./src'
    )
    .option('-y, --yes', 'Assumes yes to any questions prompted by the tool (skip version check).')

    .parse(args);
  return commander;
};
