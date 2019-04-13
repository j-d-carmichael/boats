# BOATS

Beautiful Open Api Template System

[![Build Status](https://travis-ci.org/johndcarmichael/boats.svg?branch=master)](https://travis-ci.org/johndcarmichael/boats) | [![Dependencies](https://david-dm.org/johndcarmichael/boats.svg)](https://david-dm.org/johndcarmichael/boats) | [![License](http://img.shields.io/npm/l/boats.svg)](https://github.com/johndcarmichael/boats/blob/master/LICENSE)

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
    - [Process Environment Variables](#process-environment-variables)
    - [Variables](#variables)
    - [CLI Tool](#cli-tool)
    - [Programmatic Use](#programmatic-use)
    - [Init](#init)
- [History](#history)
- [Thanks To](#thanks-to)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Summary

---
 - Bundle multiple OpenAPI 2|3 files together with [swagger-parser](https://www.npmjs.com/package/swagger-parser) or [json-refs](https://www.npmjs.com/package/json-refs) (see the history for why they both exist [History](#history))
 - Validate OpenAPI 2|3 output with [swagger-parser](https://www.npmjs.com/package/swagger-parser)
 - Use the full power of the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine within y(a)ml, type less do more
 - Unique operation id's based on file location automatically
 - Mixins within y(a)ml files
 - Variables within y(a)ml files

## Why

---
Being developers we know we don't have to type things out more than once and when we do it is annoying. Not many folk enjoy typing out endless HTML, hence template engines, nor CSS hence SASS and LESS... or any computer language, hence functions.

OpenAPI does allow for content to be injected into other files which makes for a lot of typing eg:
  -  Adding data & meta attributes when writing JSONAPI style outputs
  -  '[application/json](https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v3.0/petstore-expanded.yaml#L46)' attributes in OA3 paths

So the why is purely to implement DRY'er yaml source files so lazyness can thrive. More importantly however, repetition is not only mind numbingly boring but typically leads to mistakes, so by reducing repetition there is also a reduction is mistakes.

## Examples

---

 - [Mixin example](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L11)
 - [Unique Operation ID example](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/v1/weather/get.yml#L5)
 - [json-schema-ref-parser bundling OA3](https://github.com/johndcarmichael/boats/tree/master/example-json-schema-ref-parser.js)
 - [json-refs bundling OA2](https://github.com/johndcarmichael/boats/tree/master/example-json-refs-oa2.js)
 - [json-refs bundling OA3](https://github.com/johndcarmichael/boats/tree/master/example-json-refs-oa3.js)

## Available commands

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
  -s, --strip_value [strip]   The value removed from during creation of the uniqueOpId tpl function, defaults to "paths/"
  -v --validate <state>       Validate OA 2/3 state "on" or "off". Defaults to "on" (default: "on")
  -$, --variables [value]     Array of variables to pass to the templates, eg "-$ host=http://somehost.com -$ apikey=321654987" (default: [])
  -V, --version               output the version number
  -h, --help                  output usage information
```
---

## Features

---

BOATS ships with a few features described below.
> Tip! Add boats as an npm script for easy cli access:
```
"scripts": {
  "boats": "boats",
  ...
```

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
url: {{ host }}
```

> !Tip: These variables will override any variables injected into the tpl engine from the `process.env`

#### CLI Tool
BOATS can be used as a cli tool via an npm script eg:

package.json script
```
"build:yml": "boats -i ./src/index.yml -o ./build/api.yml
```

cli command:
```
npm run build:yml
```

#### Programmatic Use
You can also use BOATS programmatically, please see [Programmatic use of the tool](https://github.com/johndcarmichael/boats/blob/master/clean-programmatic-example.js)

#### Init
Lastly, you can initialize a project via the init command. The net result will be:
 - OpenAPI3 example files injected into your current project within a folder named src
 - Build scripts for JSON and YAML added to your package.json file for CLI use.

```
npm run boats -- --init
``` 

## History
A few years ago when swagger really exploded in popularity lots of packages started appearing to aid in the painful job of maintaining large single files of yaml (just search the internet for "merge swagger files"). The packages all did 1 main job, bundled many little files into 1 (see this [example](https://github.com/johndcarmichael/boats/tree/master/srcOA3). This is and was often done in conjunction with 2 packages, [json-refs](https://www.npmjs.com/package/json-refs) and [js-yaml](https://www.npmjs.com/package/js-yaml), json-refs would resolve all $ref file locations and the js-yaml would parse the yml to json. The net result being a big old json object of all the files which could then be written to disk. Very important for lots and lots of tools out there, from codegen to cloudfront.

However, when using json-refs to resolve the file locations the net result can be a lot of repeat code. For example, if you reference a definition by file, json-refs grabs the content of the said file and injects it into the response which is not great if you also reference it in a few other locations too, lots of duplicated yaml. To get around this the trick was to reference the swagger definition instead eg: `#/components/schemas/Temperature`, this would prevent json-refs from resolving the file and thus prevent duplicate content. Of course today all the little files built in this fashion cannot be used by tools that are able to parse multi-file openapi specs.

Enter json-schema-ref-parser. This package "crawls even the most complex JSON Schemas and gives you simple, straightforward JavaScript objects" and without duplicates. Now you can bundle multiple files together, remove dupes and output a single output that can be written to disk.

BOATS ships with both options, json-refs/js-yaml or the json-schema-ref-parser. By default this package will use the swagger-parser through to json-schema-ref-parser bundler, but passing the `-j` flag will instruct the use of the json-refs bundler. Both will run through the nunjucks tpl engine and both will be validated unless instructed not. 

If you are not using the json-refs bundler, BOATS will first mirror your input folder to your output folder; each will be parsed 1 by 1 through the tpl engine. Validation and bundling happens once this is complete. 

## Thanks To
BOATS is nothing more than a connection between other packages so big thanks to:
 - The team behind https://www.npmjs.com/package/swagger-parser
 - whitlockjc for https://www.npmjs.com/package/json-refs
 - vitaly for https://www.npmjs.com/package/js-yaml
 - The team behind https://www.npmjs.com/package/nunjucks


