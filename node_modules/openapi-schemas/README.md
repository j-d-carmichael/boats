# OpenAPI Specification Schemas

[![Cross-Platform Compatibility](https://apitools.dev/img/badges/os-badges.svg)](https://travis-ci.com/APIDevTools/openapi-schemas)
[![Build Status](https://api.travis-ci.com/APIDevTools/openapi-schemas.svg?branch=master)](https://travis-ci.com/APIDevTools/openapi-schemas)

[![Coverage Status](https://coveralls.io/repos/github/APIDevTools/openapi-schemas/badge.svg?branch=master)](https://coveralls.io/github/APIDevTools/openapi-schemas)
[![Dependencies](https://david-dm.org/APIDevTools/openapi-schemas.svg)](https://david-dm.org/APIDevTools/openapi-schemas)

[![npm](https://img.shields.io/npm/v/openapi-schemas.svg)](https://www.npmjs.com/package/openapi-schemas)
[![License](https://img.shields.io/npm/l/openapi-schemas.svg)](LICENSE)



This package contains [**the official JSON Schemas**](https://github.com/OAI/OpenAPI-Specification/tree/master/schemas) for every version of Swagger/OpenAPI Specification:

  - [Swagger 1.2](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/1.2.md)
  - [Swagger 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
  - [OpenAPI 3.0.x](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

All schemas are kept up-to-date with the latest official definitions via an automated CI/CD job. 🤖📦



Installation
--------------------------
You can install `openapi-schemas` via [npm](https://docs.npmjs.com/about-npm/).

```bash
npm install openapi-schemas
```



Usage
--------------------------

The default export contains all OpenAPI Specification versions:

```javascript
const openapi = require("openapi-schemas");

console.log(openapi.v1);    // { $schema, id, properties, definitions, ... }
console.log(openapi.v2);    // { $schema, id, properties, definitions, ... }
console.log(openapi.v3);    // { $schema, id, properties, definitions, ... }
```

Or you can import the specific version(s) that you need:

```javascript
const { openapiV1, openapiV2, openapiV3 } = require("openapi-schemas");

console.log(openapiV1);    // { $schema, id, properties, definitions, ... }
console.log(openapiV2);    // { $schema, id, properties, definitions, ... }
console.log(openapiV3);    // { $schema, id, properties, definitions, ... }
```

You can use a JSON Schema validator such as [Z-Schema](https://www.npmjs.com/package/z-schema) or [AJV](https://www.npmjs.com/package/ajv) to validate OpenAPI definitions against the specification.

```javascript
const { openapiV3 } = require("openapi-schemas");
const ZSchema = require("z-schema");

// Create a ZSchema validator
let validator = new ZSchema();

// Validate an OpenAPI definition against the OpenAPI v3.0 specification
validator.validate(openapiDefinition, openapiV3);
```



Contributing
--------------------------
Contributions, enhancements, and bug-fixes are welcome!  [File an issue](https://github.com/APIDevTools/openapi-schemas/issues) on GitHub and [submit a pull request](https://github.com/APIDevTools/openapi-schemas/pulls).

#### Building
To build the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/APIDevTools/openapi-schemas.git`

2. __Install dependencies__<br>
`npm install`

3. __Build the code__<br>
`npm run build`

4. __Run the tests__<br>
`npm test`



License
--------------------------
openapi-schemas is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.



Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://apitools.dev/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://apitools.dev/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://apitools.dev/img/badges/coveralls.svg)](https://coveralls.io)
