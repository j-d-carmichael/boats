# BOATS

Beautiful Open Api Template System

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Summary](#summary)
- [Examples](#examples)
- [Available commands](#available-commands)
- [Features](#features)
    - [Bundler](#bundler)
    - [Validation](#validation)
    - [Templating](#templating)
    - [Mixins](#mixins)
    - [Unique Operation Identifiers](#unique-operation-identifiers)
    - [Variables](#variables)
    - [CLI Tool](#cli-tool)
    - [Programmatic Use](#programmatic-use)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Summary

---

 - Bundle multiple OpenAPI 2|3 files together with [js-yaml](https://www.npmjs.com/package/js-yaml) & [json-refs](https://www.npmjs.com/package/json-refs)
 - Validate OpenAPI 2|3 output with [swagger-parser](https://www.npmjs.com/package/swagger-parser)
 - Use the full power of the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine within y(a)ml, type less do more
 - Use as a cli tool or use programmatically
 - Unique operation id's based on file location automatically
 - Mixins within y(a)ml files
 - Variables within y(a)ml files

## Examples

---

 - [Mixin example](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L11)
 - [Unique Operation ID example](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L5)
 - [OpenAPI 3 example files](https://github.com/johndcarmichael/boats/tree/master/srcOA3) 
 - [OpenAPI 2 example files](https://github.com/johndcarmichael/boats/tree/master/srcOA2) 
 - [Programmatic use of the tool](https://github.com/johndcarmichael/boats/blob/master/clean-programmatic-example.js)  
 - After adding "boats" as an npm script to this package: `npm run boats -i ./src/index.yml`

## Available commands

---

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
---

## Features

---

BOATS ships with a few features described below.

#### Bundler
There are a few tools already out there that use the js-yaml and json-refs tool combination to bundle many y(a)ml files together into a single file.
BOATS is just the same in this sense as all the rest, it will read an entry point and resolve the json references in turn resulting in a single OpenAPI file.

#### Validation
Errors will be thrown if $refs cannot be resolved properly.
The bundled output is also validated with swagger-parser, throwing errors to console if/when found.

#### Templating
Each file is passed through the Nunjucks templating engine meaning you can write Nunjucks syntax directly into the y(a)ml files.
BOATS ships with two helpful functions, `mixin` and `uniqueOpId`, but your also have the full power of the nunjucks templating functions available to you.
If you have not used Nunjucks before, it is very similar to the Twig, Blade and Django templating language.

#### Mixins
The `mixin` gives function to OpenAPI files that previously meant a lot of repetitive typing which results in less human error. With mixins you are able to wrap definitions/components in common content. For example [pagination](https://github.com/johndcarmichael/boats/blob/master/srcOA3/components/schemas/index.yml#L10) or for OA3 [content objects](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L11). 

The mixin function assumes the 1st given argument to be the relative path to the mixin template yaml file.
All additional arguments are passed as numbers variables to the Nunjucks templating engine `var<argument index>` eg `var1`
```
mixin("../../mixins/pagination.yml", "#/components/schemas/GenericSearchMeta", "#/components/schemas/Weather")
```

The mixin template can then use the arguments as [illustrated here](https://github.com/johndcarmichael/boats/blob/master/srcOA3/mixins/pagination.yml).

#### Unique Operation Identifiers
The `uniqueOpId` function reduces human error by automatically returning a unique identifier based on the files location within the file system. 
The path leading up to the entry point is always removed.
In addition the value of the "strip_value" command is also removed, if a strip value is not provided this will default to "paths/".

So the following path:
`/home/me/code/project/src/paths/v1/temperature/get.yml`

Results in:
`v1TemperatureGet`

This is especially helpful for API generators.

#### Variables
In addition to Nunjucks ability to set variables within template files: https://mozilla.github.io/nunjucks/templating.html#set

You can also pass in custom variables to your templates with the --variables option:
```
npm run boats -i ./src/index.yml -$ host=http://somedomain.com -$ email=john@boats.com
```

The variables can then be accessed via the normal nunjucks syntax eg:
```
url: {{ host }}
```

#### CLI Tool
BOATS can be used as a cli tool via an npm script eg:
```
npm run boats -i ./src/index.yml
```

#### Programmatic Use
You can also use BOATS programmatically, please see [Programmatic use of the tool](https://github.com/johndcarmichael/boats/blob/master/clean-programmatic-example.js)
