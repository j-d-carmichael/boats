# BOATS

![Boats](boats.jpg)

An OpenAPI & AsyncAPI templating system with Nunjucks... write less YAML... do more.
___

## What is it?

OpenAPI and AsyncAPI are great, writing yaml is fast... however, there is a lot of copy/paste required. Additionally, managing many routes in a single file is painful. BOATS allows you to reduce the copy and pasting with many built in helpers while at the same time breaking the 1 larger file down into many small files. The output from BOATS is also validated via [@apidevtools](https://github.com/APIDevTools) or [@asyncapi](https://github.com/asyncapi).

## Quick start
1. Initialize a new project: npm init -y
2. Set up BOATS: npx boats --init (follow the prompts)
3. Build the project: npm run build (outputs in ./build)

## Docs & Changelog
[Full documentation](https://j-d-carmichael.github.io/boats)

[Changelog](https://j-d-carmichael.github.io/boats/#/?id=changelog)

## BOATS CLI

Writing yaml files for BOATS is easier than managing a single file, but to make writing BOATS yml files even easier... there is now a BOATS CLI tool:

https://www.npmjs.com/package/@acrontum/boats-cli

## Examples
Simple examples can be found here:
- [Async API](https://github.com/j-d-carmichael/boats/tree/main/init-files/asyncapi)
- [Open API 2](https://github.com/j-d-carmichael/boats/tree/main/init-files/oa2)
- [Open API 3](https://github.com/j-d-carmichael/boats/tree/master/srcOA3)

(Refer to the [documentation](https://j-d-carmichael.github.io/boats) for additional features and details.)

## Thanks To
BOATS is nothing without the support of:
- Every [contributor](https://github.com/j-d-carmichael/boats/graphs/contributors) & [issue](https://github.com/j-d-carmichael/boats/issues)!
- [@apidevtools](https://github.com/APIDevTools)
- [@asyncapi](https://github.com/asyncapi)
- [js-yaml](https://github.com/nodeca/js-yaml)
- Mozilla [Nujucks](https://github.com/mozilla/nunjucks)
- Jetbrains [Open Source Development - Community Support](https://www.jetbrains.com/community/opensource/#support)!


[![Jetbrains](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)](https://www.jetbrains.com/community/opensource/#support) [![GitHub](https://github.githubassets.com/images/modules/dashboard/onboarding/gh-desktop.png)](https://github.com/) [![apidevtools](https://avatars.githubusercontent.com/u/43750074?s=200&v=4)](https://github.com/APIDevTools) [![asyncapi](https://avatars.githubusercontent.com/u/16401334?s=200&v=4)](https://github.com/asyncapi) [![Nujucks](https://avatars.githubusercontent.com/u/131524?s=200&v=4)](https://github.com/mozilla/nunjucks)

