# BOATS

Beautiful Open Api Template System (and AsyncAPI)
___

> Using a template engine when writing OpenAPI spec makes life a little less repetitive.

Full docsify documentation here: [https://johndcarmichael.github.io/boats/](https://johndcarmichael.github.io/boats/)

Example files can be found here:
- https://github.com/johndcarmichael/boats/tree/master/srcASYNC2
- https://github.com/johndcarmichael/boats/tree/master/srcOA2 (note the readonly use of nunjucks extend here)
- https://github.com/johndcarmichael/boats/tree/master/srcOA3

## Last publish reason
- 2020/04/27 1.13.0: New feature for the tpl healpter: nunjucksHelpers/autoComponentIndexer.js to [remove](https://github.com/johndcarmichael/boats/blob/master/srcOA3/components/schemas/index.yml.njk) a string from the def/comp/param. leaving [different naming](https://github.com/johndcarmichael/boats/blob/master/build/builtOA3_1.0.1.yml#L123).
- 2020/04/26 1.12.2: Dependency updates, moved to @asyncapi/parser from asyncapi-parser
- 2020/04/26 1.12.1: Readme for npm
- 2020/04/26 1.12.0: Auto indexer tpl helpers based on directory and file structure ([paths/index](https://github.com/johndcarmichael/boats/blob/master/srcOA3/paths/index.yml.njk), [channels/index](https://github.com/johndcarmichael/boats/blob/master/srcASYNC2/channels/index.yml.njk), [components|definitions|parameters index](https://github.com/johndcarmichael/boats/blob/master/srcOA3/components/schemas/index.yml.njk)).. less donkey work.
- 2020/04/15 1.11.0: Using deepmerge in the inector helper for more complex injections; [srcOA2/index.yml.njk](https://github.com/johndcarmichael/boats/tree/master/srcOA2)
- 2020/04/12 1.10.0: Auto detection of input type, asyncapi, openapi or swagger. -t cli arg no longer present
- 2020/04/12 1.9.1: &#128558; left a console log in place
- 2020/04/12 1.9.0: Expose convert to njk file ext, --convert_to_njk ./src
- 2020/04/12 1.8.0: New tpl helper fileName & uniqueOpId bug fix for .njk files
- 2020/04/07 1.7.5: Docs better examples readme links.
- 2020/04/07 1.7.4: Bug fix only the 1st inject found block is respected, other blocks are ignored
- 2020/04/07 1.7.3: Chore dependency update, camelcase
- 2020/04/07 1.7.2: Bug fix relating to "inject" new option "includeMethods"
- 2020/04/03 1.7.1: PR from @CasperJ to fix windows build environments 
- 2020/03/30 1.7.0: Tpl helper "inject" new option "includeMethods"
- 2020/03/28 1.6.0: New tpl helper "inject" common content to paths/channels inc. exclude list
- 2020/03/28 1.5.0: .njk ext support allowing std nunjucks tags, tip: .boatsrc
- 2020/03/08 1.4.0: Added ability to build and validate AsyncAPI yml files
- 2020/01/25 Dependencies updated and unique of id 1st segment bug fix
- 2019/11/04 Expose the dereference of swaggerparser via the new -d | --dereference cli argument
- 2019/07/14 Security update from [inquirer](https://www.npmjs.com/package/inquirer)
