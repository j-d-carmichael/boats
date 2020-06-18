
/*
 * Read a YAML file and output expects for tests
 *
 * eg:
 *   swagger: '2.0'
 *   info:
 *     version: 1.0.1
 *     title: boats
 *     description: A sample API
 *     contact:
 *       name: Swagger API Team
 *       email: john@boats.io
 *       url: 'https://github.com/johndcarmichael/boats/'
 *     license:
 *       name: Apache 2.0
 *       url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
 *
 *
 * outputs:
 *   expect(itemToTest.swagger).toBe('2.0');
 *   expect(itemToTest.info.version).toBe('1.0.1');
 *   expect(itemToTest.info.title).toBe('boats');
 *   expect(itemToTest.info.description).toBe('A sample API');
 *   expect(itemToTest.info.contact.name).toBe('Swagger API Team');
 *   expect(itemToTest.info.contact.email).toBe('john@boats.io');
 *   expect(itemToTest.info.contact.url).toBe('https://github.com/johndcarmichael/boats/');
 *   expect(itemToTest.info.license.name).toBe('Apache 2.0');
 *   expect(itemToTest.info.license.url).toBe('https://www.apache.org/licenses/LICENSE-2.0.html');
 */

const fs = require('fs');
const path = require('path');

exports.main = () => {
  const jsYaml = require('js-yaml');

  const input = process.argv[2];
  const output = process.argv[3];
  const fullInPath = path.join(process.cwd(), input || '');
  const fullOutPath = path.join(process.cwd(), output || '');

  if (!input || !fs.existsSync(fullInPath)) {
    console.error(input ? `File found ${fullInPath}` : 'Input required');
    console.error(`usage: ${path.basename(process.argv[1])} inputYaml [output]`);
    process.exit(1);
  }

  const json = jsYaml.safeLoad(fs.readFileSync(fullInPath, 'utf8'));

  const flattened = exports.flatten(json);

  if (output && fs.existsSync(fullOutPath)) {
    fs.writeFileSync(fullOutPath, '');
  }

  Object.entries(flattened).forEach(([key, value]) => {
    const expect = `expect(itemToTest.${key}).toBe(${value});`;
    if (output) {
      fs.appendFileSync(fullOutPath, expect + '\n');
    } else {
      console.log(expect);
    }
  });
};

exports.fmtProp = (prop) => {
  if (/^[a-zA-Z\$][a-zA-Z\$0-9_]*$/.test(prop)) {
    return `.${prop}`;
  }
  if (/^[0-9]+$/.test(prop)) {
    return `[${prop}]`;
  }
  return `['${prop}']`;
};

exports.fmtString = (value) => {
  if (typeof value === 'string') {
    let quote;
    if (!/'/.test(value)) {
      quote = "'";
    } else if (!/"/.test(value)) {
      quote = '"';
    } else if (!/`/.test(value)) {
      quote = '`';
    } else {
      quote = "'";
      value = value.replace(/'/g, "\\'");
    }
    value = `${quote}${value}${quote}`;
  }
  return value;
};

// https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
exports.flatten = (data) => {
  let result = {};

  const recurse = (cur, prop) => {
    if (Object(cur) !== cur) {
      result[prop] = exports.fmtString(cur);
    } else if (Array.isArray(cur)) {
      let l;
      for (let i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop ? prop + exports.fmtProp(i) : '' + i);
      }
      if (l == 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (let p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + exports.fmtProp(p) : p);
      }
      if (isEmpty) result[prop] = {};
    }
  };
  recurse(data, '');
  return result;
};

if (require.main === module) {
  exports.main();
}
