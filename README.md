# BOATS

Beautiful Open Api Template System (beta release)

[![Build Status](https://travis-ci.org/johndcarmichael/boats.svg?branch=master)](https://travis-ci.org/johndcarmichael/boats) | [![Dependencies](https://david-dm.org/johndcarmichael/boats.svg)](https://david-dm.org/johndcarmichael/boats) | [![License](http://img.shields.io/npm/l/boats.svg)](https://github.com/johndcarmichael/boats/blob/master/LICENSE)

## Summary

---
An OpenAPI preprocessor tool with an aim to writer "DRY'er" source yaml files through the use of a template engine:
 - Bundle multiple OpenAPI 2|3 files together with [swagger-parser](https://www.npmjs.com/package/swagger-parser) or [json-refs](https://www.npmjs.com/package/json-refs) (see the history for why they both exist [History](#history))
 - Validate OpenAPI 2|3 output with [swagger-parser](https://www.npmjs.com/package/swagger-parser)
 - Use the full power of the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine within y(a)ml, type less do more
 - Unique operation id's based on file location automatically
 - Mixins within y(a)ml files
 - Variables within y(a)ml files

## Features

---

BOATS ships with a few features described below.
> Tip! Add boats as an npm script for easy cli access:
```json
"scripts": {
  "boats": "boats",
  ...
```

### Init
Want to just see a demo up and running on your machine with no real effort... You can initialize a project via the init command. The net result will be:
 - Swagger2.0 or OpenAPI3 example files injected into your current project within a folder named src
 - Build scripts for JSON and YAML added to your package.json file for CLI use.

### Validation
Content is validated using swagger-parser; the validator automatically detects the OA version. Errors are output to the console.

### Templating
Each file is passed through the Nunjucks templating engine meaning you can write Nunjucks syntax directly into the y(a)ml files, write loops, use variables, whatever you need.
BOATS ships with two helpful functions, `mixin` and `uniqueOpId`, but your also have the full power of the nunjucks templating functions available to you.

If you have not used [Nunjucks](https://www.npmjs.com/package/nunjucks) before, it is very similar to the Twig, Blade and Django templating language.

#### .boatsrc 
You can pass in options to BOATS via a `.boatsrc` file containing valid json. This is how you can control the nunjucks engine, eg [Nunjucks customer-syntax](https://mozilla.github.io/nunjucks/api.html#customizing-syntax). All nunjucks options found here will be merged into the default options.

The default options are:
```json
{
    "autoescape": false,
    "tags": {
      "blockStart": "<%",
      "blockEnd": "%>",
      "variableStart": "<$",
      "variableEnd": "$>",
      "commentStart": "<#",
      "commentEnd": "#>"
    }
}
```
 
Example to override the default tags 
```json
{
  "nunjucksOptions": {
    "tags": {
      "blockStart": "[%",
      "blockEnd": "%]",
      "variableStart": "[[",
      "variableEnd": "]]",
      "commentStart": "[#",
      "commentEnd": "#]"
    }
  }
}
```

#### Template functions built in

##### mixin
Example use:
```yaml
Weathers: mixin("../../mixins/pagination.yml", "#/components/schemas/GenericSearchMeta", "#/components/schemas/Weather")
```

The `mixin` gives function to OpenAPI files that previously meant a lot of repetitive typing which results in less human error. With mixins you are able to wrap definitions/components in common content. For example [pagination](https://github.com/johndcarmichael/boats/blob/master/srcOA3/components/schemas/index.yml#L10) or for OA3 [content objects](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L11). 

The mixin function assumes the 1st given argument to be the relative path to the mixin template yaml file.

All additional arguments are passed as numbers variables to the Nunjucks templating engine `var<argument index>` eg `var1`

The mixin template can then use the arguments as [illustrated here](https://github.com/johndcarmichael/boats/blob/master/srcOA3/mixins/pagination.yml).

##### packageJson
Example use:
```yaml
openapi: "3.0.0"
info:
  version: <$ packageJson('version') $>
```

Returns the value of an expected attribute to be found in your `package.json` or throws an error. 

##### uniqueOpId
Example use:
```yaml
tags:
  - temperature
summary: Temperature data
description: Get the latest temperature
operationId: <$ uniqueOpId() $>
```
The `uniqueOpId` function reduces human error by automatically returning a unique identifier based on the files location within the file system. 
The path leading up to the entry point is always removed.
In addition the value of the "strip_value" command is also removed, if a strip value is not provided this will default to "src/paths/".

So the following path:
`/home/me/code/project/src/paths/v1/temperature/get.yml`

Results in:
`v1TemperatureGet`

Each segment of the path is run through [camelcase](https://github.com/sindresorhus/camelcase#readme) so `this-folder` results in `thisFolder`

This is especially helpful for API generators eg: codegen

#### Custom template functions (your own)
It is possible to inject your own helper functions into the Nunjucks tpl engine. For example, you may wish to inject your own helper function that would automatically inject the package.json version number (bad example as you could use the above builtin function, but you get the idea) into the OpenAPI index file. This is how it would be done:

Pass to the cli tool a helper function path. The path should be relative to your entry point, typically where your `package.json` lives:
```
boats -i ./src/index.yml -o ./build/myapi.yml -f ./nunjucksHelpers/injectPackageJsonVersion.js -f ./someOtherHelper.js
```

The `./helpers/injectPackageJsonVersion.js` should export a single default function:
```javascript
const packageJson = require('../package.json')
module.exports = () => {
  // assuming this is a valid package json file
  return packageJson.version
}
```

In your yaml file you can now access the custom function by file name:
```yaml
info:
  version: <$ injectPackageJsonVersion() $>
```

 - Customer helpers are injected via the [Nunjuck's addGlobal function](https://mozilla.github.io/nunjucks/api.html#addglobal).
 - A helper function should use the `function` keyword declaration to gain access to the nunjucks context.
 - The name of the helper file will be the name of the function, non-alphanumeric (and _) characters will be stripped.

#### Process Environment Variables
During automated build chains it is not uncommon for api keys and dynamic URIs to be injected into the outputted OpenAPI files, this is common with AWS's cloud formation when used with dynamic containers.

To accommodate this, all `process.env` variables are exposed in read-only format to the templates.

To enable easier development with `process.env` variables BOATS also makes use of the [dotenv](https://www.npmjs.com/package/dotenv) package during cli use only.

If a `.env` file is found at the root of your project then this will be parsed by dotenv and subsequently be made available to the Nunjucks engine as a tpl variable.

> !Tip: Do not add the .env file to your git repo, this is only for development purposes, read the [dotenv](https://www.npmjs.com/package/dotenv) docs. Your CI tool should use proper env variables during a build chain.

#### Variables
In addition to Nunjucks ability to set variables within template files: https://mozilla.github.io/nunjucks/templating.html#set

You can also pass in custom variables to your templates with the --variables option:
```
npm run boats -i ./src/index.yml -$ host=http://somedomain.com -$ email=john@boats.com
```

The variables can then be accessed via the normal nunjucks syntax eg:
```
url: <$ host $>
```

> !Tip: These variables will override any variables injected into the tpl engine from the `process.env`

### CLI Tool
BOATS can be used as a cli tool via an npm script eg:

package.json script
```
"build:yml": "boats -i ./src/index.yml -o ./build/api.yml
```

cli command:
```
npm run build:yml
```

#### Available commands

---

Available commands (possible by [commander](https://www.npmjs.com/package/commander)):
```
Usage: boats [options]

Options:
  --init                      Inject a skeleton yml structure to the current directory named /src/...
  -i, --input [path]          The relative path to the main input file eg "./src/index.yml"
  -o, --output [path]         The relative path to the main output file eg "./built/bundled.yml" 
                              (if json_refs is not used the output directory will also contain the compiled tpl files)
  -x, --exclude_version       By default the OA version is injected into the file name, this option stops this happening.
  -j, --json_refs             If passed the json-refs bundler will be used instead of swagger-parser's bundler.
  -I, --indentation <indent>  The numeric indentation, defaults to 2 if option passed (default: 2)
  -s, --strip_value [strip]   The value removed from during creation of the uniqueOpId tpl function, defaults to "src/paths/"
  -v --validate <state>       Validate OA 2/3 state "on" or "off". Defaults to "on" (default: "on")
  -$, --variables [value]     Array of variables to pass to the templates, eg "-$ host=http://somehost.com -$ apikey=321654987" (default: [])
  -V, --version               output the version number
  -h, --help                  output usage information
```
---

### Programmatic Use
You can also use BOATS programmatically, just require (import if you are using a bundler) the lib into your project.

```
npm run boats -- --init
``` 

## Thanks To
BOATS is nothing more than a connection between other packages so big thanks to:
 - The team behind https://www.npmjs.com/package/swagger-parser
 - vitaly for https://www.npmjs.com/package/js-yaml
 - The team behind https://www.npmjs.com/package/nunjucks
