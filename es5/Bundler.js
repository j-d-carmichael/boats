'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mixin = require('./Mixin');

var _Mixin2 = _interopRequireDefault(_Mixin);

var _commander = require('commander');

var program = _interopRequireWildcard(_commander);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var resolveRefs = require('json-refs').resolveRefs;
var YAML = require('js-yaml');
var dd = require('../dd');

var Bundler = function () {

  /**
   * @param program
   * {
   *  input: string,
   *  appendVersion:   ? bool defaults to false
   * }
   */
  function Bundler() {
    var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Bundler);

    if (!program.input) {
      dd('No input provided');
    } else {
      if (!_fsExtra2.default.existsSync(program.input)) {
        dd('File does not exist. (' + program.input + ')');
      }
    }
    this.mainJSON = '';
    this.appendVersion = program.exclude_version !== true;
    this.input = program.input;
    this.validate = program.validate === 'on';
    this.output = program.output || false;
    this.indentation = program.indentation || 2;
    this.originalIndentation = program.originalIndentation || 2;
  }

  _createClass(Bundler, [{
    key: 'readJsonFile',
    value: function readJsonFile(file) {
      try {
        return JSON.parse(_fsExtra2.default.readFileSync(file));
      } catch (err) {
        return null;
      }
    }
  }, {
    key: 'packageJson',
    value: function packageJson() {
      return this.readJsonFile('./package.json');
    }
  }, {
    key: 'parseMainLoaderOptions',
    value: function parseMainLoaderOptions() {
      var _this = this;

      return {
        loaderOptions: {
          processContent: function processContent(res, callback) {
            try {
              _Mixin2.default.injector(res.text, res.location, _this.originalIndentation).then(function (text) {
                callback(null, YAML.safeLoad(text));
              }).catch(dd);
            } catch (e) {
              dd({
                msg: 'Error parsing yml',
                e: e
              });
            }
          }
        }
      };
    }
  }, {
    key: 'parseMainRoot',
    value: function parseMainRoot() {
      return YAML.safeLoad(_fsExtra2.default.readFileSync(this.input).toString());
    }
  }, {
    key: 'parseMain',
    value: function parseMain() {
      var _this2 = this;

      return new Promise(function (resolve) {
        var root = _this2.parseMainRoot();
        var pwd = process.cwd();
        process.chdir(_path2.default.dirname(_this2.input));
        resolveRefs(root, _this2.parseMainLoaderOptions()).then(function (results) {
          _this2.mainJSON = results.resolved;
          _this2.validator().then(function () {
            process.chdir(pwd);
            return resolve(_this2.mainJSON);
          }).catch(dd);
        }).catch(dd);
      });
    }
  }, {
    key: 'validator',
    value: function validator() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (!_this3.validate) {
          var SwaggerParser = require('swagger-parser');
          SwaggerParser.validate(_this3.cloneObject(_this3.mainJSON), {}, function (e) {
            if (e) {
              return reject(e.message);
            }
            return resolve();
          }).catch(reject);
        } else {
          return resolve();
        }
      });
    }
  }, {
    key: 'cloneObject',
    value: function cloneObject(src) {
      return JSON.parse(JSON.stringify(src));
    }
  }, {
    key: 'lastChar',
    value: function lastChar(string) {
      return string[string.length - 1];
    }
  }, {
    key: 'removeLastChar',
    value: function removeLastChar(str) {
      return str.slice(0, -1);
    }
  }, {
    key: 'getVersion',
    value: function getVersion() {
      var swagVersion = '';
      if (!this.appendVersion) {
        return swagVersion;
      }
      var parsedResltObj = this.mainJSON;
      if (parsedResltObj.info.version) {
        swagVersion = parsedResltObj.info.version;
      } else if (!program.Version) {
        var packageJson = this.packageJson();
        if (packageJson.version) {
          swagVersion = packageJson.version;
        } else {
          return swagVersion;
        }
      }
      return '_' + swagVersion;
    }
  }, {
    key: 'getFileName',
    value: function getFileName(filePath) {
      var name = _path2.default.basename(filePath).replace(_path2.default.extname(filePath), '');
      return name + this.getVersion() + _path2.default.extname(filePath);
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath(filePath) {
      return _path2.default.join(_path2.default.dirname(filePath), this.getFileName(filePath));
    }
  }, {
    key: 'writeFile',
    value: function writeFile(filePath, contents) {
      try {
        _fsExtra2.default.ensureDirSync(_path2.default.dirname(filePath));
        return _fsExtra2.default.writeFileSync(this.getFilePath(filePath), contents);
      } catch (e) {
        dd({
          msg: 'Error writing file',
          e: e
        });
      }
    }
  }, {
    key: 'toJsonFile',
    value: function toJsonFile(filePath) {
      var _this4 = this;

      this.output = filePath || false;
      return new Promise(function (resolve, reject) {
        _this4.toJSON().then(function (json) {
          var jsonString = JSON.stringify(_this4.mainJSON, null, _this4.indentation);
          if (!_this4.destination) {
            console.log(jsonString);
            return resolve();
          }
          _this4.writeFile(filePath, jsonString);
          resolve('File written to: ' + _this4.getFilePath(filePath));
        }).catch(reject);
      });
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.parseMain().then(function (json) {
          return resolve(json);
        }).catch(reject);
      });
    }
  }, {
    key: 'toYamlFile',
    value: function toYamlFile(filePath) {
      var _this6 = this;

      this.output = filePath || false;
      return new Promise(function (resolve, reject) {
        _this6.toYAML().then(function (yml) {
          if (!_this6.output) {
            console.log(yml);
            return resolve();
          }
          _this6.writeFile(filePath, yml);
          resolve('File written to: ' + _this6.getFilePath(filePath));
        }).catch(reject);
      });
    }
  }, {
    key: 'toYAML',
    value: function toYAML() {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        _this7.parseMain().then(function (json) {
          return resolve(YAML.safeDump(json, _this7.indentation));
        }).catch(reject);
      });
    }
  }]);

  return Bundler;
}();

exports.default = Bundler;
module.exports = exports.default;