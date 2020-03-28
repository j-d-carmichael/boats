Swagger Methods
============================
#### HTTP methods that are supported by Swagger 2.0

[![Cross-Platform Compatibility](https://apitools.dev/img/os-badges.svg)](https://travis-ci.com/APIDevTools/swagger-methods)
[![Build Status](https://api.travis-ci.com/APIDevTools/swagger-methods.svg)](https://travis-ci.com/APIDevTools/swagger-methods)
[![Coverage Status](https://coveralls.io/repos/github/APIDevTools/swagger-methods/badge.svg?branch=master)](https://coveralls.io/github/APIDevTools/swagger-methods?branch=master)

[![npm](https://img.shields.io/npm/v/swagger-methods.svg?branch=master)](https://www.npmjs.com/package/swagger-methods)
[![Dependencies](https://david-dm.org/APIDevTools/swagger-methods.svg)](https://david-dm.org/APIDevTools/swagger-methods)
[![License](https://img.shields.io/npm/l/swagger-methods.svg)](LICENSE)

This is an array of lower-case HTTP method names that are supported by the [Swagger 2.0 spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md).

This module is [tested](test/index.spec.js) against the [Swagger 2.0 schema](https://www.npmjs.com/package/swagger-schema-official)


Installation
--------------------------
Install using [npm](https://docs.npmjs.com/about-npm/):

```bash
npm install swagger-methods
```


Usage
--------------------------

```javascript
var methods = require('swagger-methods');

methods.forEach(function(method) {
  console.log(method);
});

// get
// put
// post
// delete
// options
// head
// patch
```


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/APIDevTools/swagger-methods/issues) on GitHub and [submit a pull request](https://github.com/APIDevTools/swagger-methods/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. **Clone this repo**<br>
`git clone https://github.com/APIDevTools/swagger-methods.git`

2. **Install dev dependencies**<br>
`npm install`

3. **Run the unit tests**<br>
`npm test`


License
--------------------------
[MIT license](LICENSE). Use it however you want.

Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jstools.dev/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jstools.dev/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jstools.dev/img/badges/coveralls.svg)](https://coveralls.io)
