# BOATS

Beautiful Open Api Template System

# Table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Summary](#summary)
- [Examples](#examples)
- [Install and use locally via cli](#install-and-use-locally-via-cli)
- [How it works](#how-it-works)
  - [Initialise skeleton swagger-chunk files](#initialise-skeleton-swagger-chunk-files)
  - [Managing operation ids](#managing-operation-ids)
  - [Overriding the base host](#overriding-the-base-host)
  - [Clean up leaf values](#clean-up-leaf-values)
  - [Use programmatically](#use-programmatically)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Summary
 - Bundle OpenAPI 2|3 files together.
 - Validate Open API 2|3 output.
 - Mixins within y(a)ml files
 - Variables within y(a)ml files
 - Use the full power of the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine

## Examples
For a full example please view the example folder within the swagger-chunk repo.: [https://github.com/jdcrecur/swagger-chunk/tree/master/srcOA3](https://github.com/jdcrecur/swagger-chunk/tree/master/srcOA3)

## Install and use locally via cli
Installing:
```
npm i --save swagger-chunk
```

Running swagger-chunk and outputting the compiled contents to file (typically you would add this to a script in your package.json file):
```
node node_modules/swagger-chunk -o yaml -e yml -i ./src/index.yml -D ./build/ -d weather_app_s2jsonapi
```

The following options are available, made easily possible by [commander](https://www.npmjs.com/package/commander)
```
Usage: oats [options]

Options:
  -V, --version               output the version number
  --init                      Inject a skeleton yml structure to the current directory named /src/...
  -i, --input [path]          The relative path to the main input file eg "./src/index.yml"
  -o, --output [path]         Path to the target eg "./build/weather_api.json|yaml|yml". The version of the api will be injected automatically based on the version from within the OA index if present. If option not passed the output will be in the terminal.
  -x, --exclude_version       Exclude the OA version from the generated output file.
  -I, --indentation [indent]  The numeric indentation, defaults to 2 if option passed
  -s, --strip_value [strip]   The value removed from during creation of the uniqueOpId tpl function, defaults to "paths/"
  -v --validate <state>       Validate OA 2/3 state "on" or "off". Defaults to "on" (default: "on")
  -h, --help                  output usage informat
```

An example use via a package.json file:
```
{
    "name": "gateway_swagger",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "build:json": "swagger-chunk -i ./src/index.yml -o json -D ./build/ -d swagger2_api",
        "build:yaml": "swagger-chunk -i ./src/index.yml -e yaml -D ./build/ -d swagger2_api",
        "build:yaml-and-inject-uniqueOperationIds": "swagger-chunk -i ./src/index.yml -e yaml -D ./build/ -d swagger2_api -m",
        "build:all": "npm run build:json && npm run build:yaml"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
        "swagger-chunk": "2.3.2"
    }
}
```
In conjunction with the aforementioned [https://github.com/jdcrecur/swagger-chunk/tree/master/src](https://github.com/jdcrecur/swagger-chunk/tree/master/src) it can be seen how to hold an api contract within an own git repo and built using swagger-chunk.

## How it works
Using a combination of [json-refs](https://www.npmjs.com/package/json-refs) and [js-yaml](https://www.npmjs.com/package/js-yaml), [swagger-chunk](https://www.npmjs.com/package/swagger-chunk) combines multiple [YAML](http://yaml.org) files to output a single JSON or YAML file.

Swagger-chunk will automatically extract the swagger version number from the parsed yml and append to the file name produced, helping ensure little confusion when publishing changes to your API swagger documentation.

If you are familiar with [Swagger](https://swagger.io) then you will likely be familiar with the concept of definitions (or components in v3/OpenAPI) and referencing them with `$ref` with the value in single quotes prefixed with a # for example:
 ```
 $ref: "#/definitions/Weather"
 ```

Using [swagger-chunk](https://www.npmjs.com/package/swagger-chunk) you can use the `$ref` feature's value as a path to another yml file, swagger-chunk will try to fetch the contents of the path and inject into the file. This technique allows you to break up what would otherwise be potentially 1000's of lines into smaller re-usable chunks. For example:
 ```
 $ref: ./definitions/Weather.yml
 ```

### Initialise skeleton swagger-chunk files
You can kick start your swagger documentation code base by running the below command. The command will result in a new sub directory from the `current working directory` the command is run from:

From locally installed:
```
node node_modules/swagger-chunk --init
```

### Managing operation ids
Ensuring the operation ids are unique for every file can be a pain in the arse. If you layout your files in the same pattern demonstrated in the "src" folder of this npm package you can then manage them automatically, each id will be a camelCase string of the file path. As a file system prevents files with duplicate file paths for existing this then means that all the operationId's will also be unique.

Example, inject then continue to bundle:
```
swagger-chunk -i src/index.yml -m
```
or stop after injecting the id's
```
swagger-chunk -i src/index.yml -M
```

> Warning: If you have not used this feature before, it is advisable to run this on a clean git head allowing you to revert the file changes it will make if needed.

> This feature strips 'src/paths/ from the file path for the operation id, change this as required with the -s flag'

### Overriding the base host
Swagger 2 only offers the option to insert a single host, unlike OpenApi3. To bypass the restriction you can override the host using swagger-chunk by passing in the -h flag. This will replace the host found in the swagger source with that passed.

### Clean up leaf values
On occasion you may find yourself importing yaml from a 3rd party converter which can sometimes result in trialing commas. You can automatically strip these from the final output by passing the `-c` flag for `--clean_leaf`

### Use programmatically
Command line use is essentially an abstraction to the actual SwaggerChunk class, all the parameters available for cli are available via methods.

You have the option to import the es6 class or the es5 commonJS module.

For an example use of the pragmatical use, please view the [example](https://github.com/jdcrecur/swagger-chunk/tree/master/example) `package.json` file.
