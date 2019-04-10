# BOATS

Beautiful Open Api Template System

# Table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Summary](#summary)
- [Examples](#examples)
- [Available commands](#available-commands)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Summary
 - Bundle multiple OpenAPI 2|3 files together
 - Validate Open API 2|3 output
 - Unique operation id's based on file location automatically
 - Mixins within y(a)ml files
 - Variables within y(a)ml files
 - Use the full power of the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine within y(a)ml
 - Use as a cli tool or use programmatically

## Examples
 - [Mixin example](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L11)
 - [Unique Operation ID example](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L5)
 - [OpenAPI 3 example files](https://github.com/johndcarmichael/boats/tree/master/srcOA3) 
 - [OpenAPI 2 example files](https://github.com/johndcarmichael/boats/tree/master/srcOA2) 
 - [Programmatic use of the tool](https://github.com/johndcarmichael/boats/blob/master/clean-programmatic-example.js)  
 - After adding "boats" as an npm script to this package: `npm run boats -i ./src/index.yml`

## Available commands
Available commands (possible by [commander](https://www.npmjs.com/package/commander)):
```
Usage: boats [options]

Options:
  --init                      Inject a skeleton yml structure to the current directory named /src/...
  -i, --input [path]          The relative path to the main input file eg "./src/index.yml"
  -o, --output [path]         Path to the target eg "./build/weather_api.json|yaml|yml". The version of the api will be injected automatically based on the version from within the OA index if present. If option not passed the output will be in the terminal.
  -x, --exclude_version       Exclude the OA version from the generated output file.
  -I, --indentation [indent]  The numeric indentation, defaults to 2 if option passed
  -s, --strip_value [strip]   The value removed from during creation of the uniqueOpId tpl function, defaults to "paths/"
  -v --validate <state>       Validate OA 2/3 state "on" or "off". Defaults to "on" (default: "on")
  -V, --version               output the version number of the tool  
  -h, --help                  output usage informat
```
