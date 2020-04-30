# BOATS

Beautiful Open / Async Template System

## Summary

---
An AsyncAPI/OpenAPI preprocessor tool with an aim to writer "DRY'er" source yaml files through the use of a template engine:
 - Bundle multiple yml files together with [json-schema-ref-parser](https://www.npmjs.com/package/json-schema-ref-parser)
 - Validate AsyncAPI output with [asyncapi/parser-js](https://github.com/asyncapi/parser-js)
 - Validate OpenAPI 2|3 output with [swagger-parser](https://www.npmjs.com/package/swagger-parser)
 - Use the full power of the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine within y(a)ml, type less do more
 - Unique operation id's based on file location automatically
 - Inject common content and responses
 - Mixins within y(a)ml files
 - Variables within y(a)ml files
 - See [built in functions](#template-functions-built-in) below for more

Point boats at an entry index file and let it compile the rest automatically, either AsyncApi, OpenAPI or Swagger

## Features

---

BOATS ships with a few features described below.
> Tip! Add boats as an npm script for easy cli access:
```json
"scripts": {
  "boats": "boats",
  ...
```

### Getting started 
Want to just see a demo up and running on your machine with no real effort... You can initialize a project via the init command. The net result will be:
 - Swagger2.0 or OpenAPI3 example files injected into your current project within a folder named src
 - Build scripts for JSON and YAML added to your package.json file for CLI use.

```
npm run boats -- --init
``` 

Want to start with a bare bones repo then just install and add these scripts to get going:
```json
{
  "name": "awesome-api-d",
  "description": "Awesome API Documentation - written in openapi",
  "version": "1.0.0",
  "scripts": {
    "boats": "boats",
    "build:json": "boats -i ./src/index.yml -o ./build/awesome-api-d.json",
    "build:yaml": "boats -i ./src/index.yml -o ./build/awesome-api-d.yml",
    "build": "npm run build:json && npm run build:yaml"
  },
  "dependencies": {
    "boats": "latest"
  }
}
```


### Dereference the output
When building pass the `-d` or `--dereference` option and the compiled swagger document will be passed via the [dereference](https://apitools.dev/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback) method to fully dereference document. Helpful for when working with the likes of AWS for example.

### Validation
Errors are output to the console.

### Templating
As Nunjucks is used as the tpl engine, this means if you use a smart IDE such as intellij you are able to utilize the syntax highlight of both yml and njk.

If you come from a PHP world you will already be used to this with Twig, Blade or even back in the day with Smarty. These you will be used to viewing proper html syntax highlighting but at the same time good function/condition highlighting that the tpl engine offers.

Set your IDE to use the twig syntax for *.njk files:
![Settings panel](./images/njk_syntax_highlighting.png)

Now your IDE will show both yaml and nunjucks styntax highlighting in one view without the swagger/openapi validator complaining but we can still jump through the files with "control+mouse click", eg:
![Settings panel](./images/njk_yaml.png)

Each file is passed through the Nunjucks templating engine meaning you can write Nunjucks syntax directly into the y(a)ml files, write loops, use variables, whatever you need.
BOATS ships with two helpful functions, `mixin` and `uniqueOpId`, but your also have the full power of the nunjucks templating functions available to you.

If you have not used [Nunjucks](https://www.npmjs.com/package/nunjucks) before, it is very similar to the Twig, Blade and Django templating language.

#### File ext. 
You may use `.yaml` or `.yml`.

You may also use, since version 1.50, the nunjucks extension, but only on .yml (not .yaml), eg: `something.yml.njk`.

Adding the .njk extension allows your ide to lay on nice syntax highlighting (for jetbrains, just add *.njk to the Twig mapping in you settings for file types). 

Adding the `.yml.njk` allows the ide to easily use the yaml and nunjucks highlighting in 1 which is pretty cool.

Additionally, when using the `.yml.njk` ext you will also want to back back to the default njk tags by not setting any tags in your `.boatsrc` file


#### .boatsrc 
You can pass in options to BOATS via a `.boatsrc` file containing valid json. This is how you can control the nunjucks engine, eg [Nunjucks customer-syntax](https://mozilla.github.io/nunjucks/api.html#customizing-syntax). All nunjucks options found here will be merged into the default options.
 
Example to override the default tag delimiters
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

If you use the `.yml.njk`, you will want to just use the default tags from nunjucks. 

The following just lets nunjucks pick the defaults (ie the ones in [their docs](https://mozilla.github.io/nunjucks/templating.html)) which then allow the ide to highlight the files correctly.:
```json
 {
   "nunjucksOptions": {
     "tags": {}
   }
}
```

#### Template functions built in

TIP: The tpl helpers and the examples in this repo all use the [default nunjucks helpers](https://mozilla.github.io/nunjucks/templating.html).

##### Auto Index Files
In async/swagger/openapi the channels/paths require an index file to register the routes.
By the way [json-schema-ref-parser](https://www.npmjs.com/package/json-schema-ref-parser), unless you create an index file then the references to component/definitions will not look pretty and easily break other tools.
Maintaining these index files is quite a monotonous chore, and very human error prone. 

The index file is nothing more duplicate data; we already carefully name our folders and files to then manually go and type it all out again in a not fun to manage index file.

The easiest way to explain this is to look at the examples and their outputs:
- Paths indexer, https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/index.yml.njk resulting in the compiled file: https://github.com/johndcarmichael/boats/blob/master/build/builtOA3_1.0.1.yml#L18 This indexer expects to find single files within an end url segment folder to contain the avilable http verbs. Also not the curly braces for dynamic url parameters: https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/weather/id/%7Bid%7D/get.yml.njk
- Channel indexer, https://github.com/johndcarmichael/boats/blob/master/srcASYNC2/channels/index.yml.njk is slightly different to the paths as a single channel file is expected to contain all subscribe and publish data in on.
- Components|definitions|parameters indexer https://github.com/johndcarmichael/boats/blob/master/srcOA3/components/schemas/index.yml.njk will create a UpperCamelCase index file.

The 3 types of indexers:
Path Indexer
```
{{ autoPathIndexer() }}
```
Channel Indexer
```
{{ autoChannelIndexer() }}
```
Definition/Component/Parameter Indexer:
```
{{ autoComponentIndexer() }}
```
If you have an older set of BOATS files then you might have named the model files without the word model, to strip model from the naming:
```
{{ autoComponentIndexer('Model') }}
```



##### inject

Example: https://github.com/johndcarmichael/boats/blob/master/srcOA2/index.yml.njk#L25

The inject helper allows you to inject content to many operations from a single block. In the example above we are injecting a header parameter to every path method.

For openapi, the content will be merged/concat/injected into paths that are not excluded.

For asyncapi, the content will be merged/concat/injected into [channels](https://github.com/johndcarmichael/boats/blob/master/srcASYNC2/index.yml#L19).

Type less do more.

##### mixin
Example use:
```yaml
Weathers: mixin("../../mixins/pagination.yml", "#/components/schemas/GenericSearchMeta", "#/components/schemas/Weather")
```

The `mixin` gives function to OpenAPI files that previously meant a lot of repetitive typing which results in less human error. With mixins you are able to wrap definitions/components in common content. For example [pagination](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L9).

The mixin function assumes the 1st given argument to be the relative path to the mixin template yaml file.

All additional arguments are passed as numbers variables to the Nunjucks templating engine `var<argument index>` eg `var1`

Mixin file [example here](https://github.com/johndcarmichael/boats/blob/master/srcOA3/mixins/response/json.pagination.yml) and [here](https://github.com/johndcarmichael/boats/blob/master/srcOA3/mixins/request/json.yml).

The mixin will automatically calculate indents. If you use a mixin for plural models [like this](https://github.com/johndcarmichael/boats/blob/master/srcOA3/components/schemas/weather/models.yml.njk), then an additional argument can be added to the end: 
```
{{ mixin("../../../mixins/response/pagination.yml.njk", "../generic/searchMeta.yml.njk", "./model.yml.njk", "--skip-auto-indent") }}
```

In most cases the additional indentation which not break anything, but if a clean partial output file is required...

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

##### autoTag
Calculates the tag based on the location of the file in the folder structure:
```yaml
tags:
  - <$ autoTag() $>
```

The following path:
`src/paths/temperature/get.yml`
Results in:
`Temperature`

The following path:
`src/paths/temperature/europe/get.yml`
Results in:
`Temperature`

#### Custom template functions (your own)
It is possible to inject your own helper functions into the Nunjucks tpl engine. For example, you may wish to inject your own helper function that would automatically inject the package.json version number (bad example as you could use the above builtin function, but you get the idea) into the OpenAPI index file. This is how it would be done:

Pass to the cli tool a helper function path. The path should be relative to your entry point, typically where your `package.json` lives:
```
boats -i ./src/index.yml -o ./build/myapi.yml -f ./nunjucksHelpers/injectPackageJsonVersion.js -f ./someOtherHelper.js
```

The `./nunjucksHelpers/injectPackageJsonVersion.js` should export a single default function:
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

### CLI features
BOATS can be used as a cli tool via an npm script eg:

package.json script
```
"build:yml": "boats -i ./src/index.yml -o ./build/api.yml
```

cli command:
```
npm run build:yml
```

#### Switch extension types with a single command
If you have an existing repository with .yml files and want to convert to .yml.njk you can convert all the file extensions, and the references with one command:
```
npm run boats -- --convert_to_njk ./src
```

To convert all back to yml:
```
npm run boats -- --convert_to_yml ./src
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
  -d, --dereference           Will pass the output via https://apitools.dev/swagger-parser/docs/swagger-parser.html#dereferenceapi-options-callback
  -I, --indentation <indent>  The numeric indentation, defaults to 2 if option passed (default: 2)
  -s, --strip_value [strip]   The value removed from during creation of the uniqueOpId tpl function, defaults to "src/paths/"
  -t, --type [type]           The validator type, asyncapi or openapi, default is openapi 
  -v --validate <state>       Validate OA 2/3 state "on" or "off". Defaults to "on" (default: "on")
  -$, --variables [value]     Array of variables to pass to the templates, eg "-$ host=http://somehost.com -$ apikey=321654987" (default: [])
  -V, --version               output the version number
  -h, --help                  output usage information
```
---

### Programmatic Use
You can also use BOATS programmatically, just require (import if you are using a bundler) the lib into your project.

### Deprecated
If you were using the pre 1.0.0 release, sorry, but we the json-refs bundler was dropped.

## Thanks To
BOATS is nothing more than a connection between other packages so big thanks to:
 - The team behind https://www.npmjs.com/package/swagger-parser
 - The team behind https://github.com/asyncapi/parser-js
 - vitaly for https://www.npmjs.com/package/js-yaml
 - The team behind https://www.npmjs.com/package/nunjucks
