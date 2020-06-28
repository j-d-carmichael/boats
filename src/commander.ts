import commander from 'commander'
import collect from '@/commander.collect'
import helperFunctions from '@/commander.helperFunctions'

export default (args: any[]): any => {
  commander
    .option('--init', 'Inject a skeleton yml structure to the current directory named /src/...')

    .option('-i, --input [path]', 'The relative path to the main input file eg "./src/index.yml"')

    .option('-o, --output [path]', `The relative path to the main output file eg "./built/bundled.yml"
                            (if json_refs is not used the output directory will also contain the compiled tpl files)`)

    .option('-$, --variables [value]', 'Array of variables to pass to the templates, eg "-$ host=http://somehost.com -$ apikey=321654987"', collect, [])
    .option('-f, --functions [filepath]', 'Array of helper function relative paths, eg "-f ./helperOne.js -f ./helperTwo"', helperFunctions, [])
    .option('-d, --dereference', 'Will pass the output via https://apitools.dev/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback')
    .option('-s, --strip_value <strip>', 'The value removed from the file path to create the uniqueOpId, it not provided will be either src/paths/ or src/channels/ based on api type.', false)
    .option('-x, --exclude_version', 'By default the OA version is injected into the file name, this option stops this happening.')
    .option('--convert_to_njk <localDirectory>', 'Convert to .yml.njk, pass in a relative src folder eg: --convert_to_njk ./src')
    .option('--convert_to_yml <localDirectory>', 'Converted to .yml.njk syntax but want to revert: --convert_to_yml ./src')
    .parse(args);

  return commander;
};
