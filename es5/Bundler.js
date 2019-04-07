"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Mixin = _interopRequireDefault(require("./Mixin"));

var _calculateIndentFromLineBreak = _interopRequireDefault(require("./calculateIndentFromLineBreak"));

var program = _interopRequireWildcard(require("commander"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var resolveRefs = require('json-refs').resolveRefs;

var YAML = require('js-yaml');

var dd = require('../dd');

var Bundler =
/*#__PURE__*/
function () {
  /**
   * @param program
   * {
   *  input: string,
   *  appendVersion:   ? bool defaults to false
   * }
   */
  function Bundler() {
    var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Bundler);

    if (!program.input) {
      dd('No input provided');
    } else {
      if (!_fsExtra["default"].existsSync(program.input)) {
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

  (0, _createClass2["default"])(Bundler, [{
    key: "readJsonFile",
    value: function readJsonFile(file) {
      try {
        return JSON.parse(_fsExtra["default"].readFileSync(file));
      } catch (err) {
        return null;
      }
    }
  }, {
    key: "packageJson",
    value: function packageJson() {
      return this.readJsonFile('./package.json');
    }
  }, {
    key: "parseMainLoaderOptions",
    value: function parseMainLoaderOptions() {
      var _this = this;

      return {
        loaderOptions: {
          processContent: function () {
            var _processContent = (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee(res, callback) {
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return _Mixin["default"].injector(res.text, res.location, _this.originalIndentation);

                    case 3:
                      res.text = _context.sent;
                      callback(null, YAML.safeLoad(res.text));
                      _context.next = 10;
                      break;

                    case 7:
                      _context.prev = 7;
                      _context.t0 = _context["catch"](0);
                      dd({
                        msg: 'Error parsing yml',
                        e: _context.t0
                      });

                    case 10:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, null, [[0, 7]]);
            }));

            function processContent(_x, _x2) {
              return _processContent.apply(this, arguments);
            }

            return processContent;
          }()
        }
      };
    }
  }, {
    key: "parseMainRoot",
    value: function parseMainRoot() {
      return YAML.safeLoad(_fsExtra["default"].readFileSync(this.input).toString());
    }
  }, {
    key: "parseMain",
    value: function parseMain() {
      var _this2 = this;

      return new Promise(function (resolve) {
        var root = _this2.parseMainRoot();

        var pwd = process.cwd();
        process.chdir(_path["default"].dirname(_this2.input));
        resolveRefs(root, _this2.parseMainLoaderOptions()).then(function (results) {
          _this2.mainJSON = results.resolved;

          _this2.validator().then(function () {
            process.chdir(pwd);
            return resolve(_this2.mainJSON);
          })["catch"](dd);
        })["catch"](dd);
      });
    }
  }, {
    key: "validator",
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
          })["catch"](reject);
        } else {
          return resolve();
        }
      });
    }
  }, {
    key: "cloneObject",
    value: function cloneObject(src) {
      return JSON.parse(JSON.stringify(src));
    }
  }, {
    key: "lastChar",
    value: function lastChar(string) {
      return string[string.length - 1];
    }
  }, {
    key: "removeLastChar",
    value: function removeLastChar(str) {
      return str.slice(0, -1);
    }
  }, {
    key: "getVersion",
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
    key: "getFileName",
    value: function getFileName(filePath) {
      var name = _path["default"].basename(filePath).replace(_path["default"].extname(filePath), '');

      return name + this.getVersion() + _path["default"].extname(filePath);
    }
  }, {
    key: "getFilePath",
    value: function getFilePath(filePath) {
      return _path["default"].join(_path["default"].dirname(filePath), this.getFileName(filePath));
    }
  }, {
    key: "writeFile",
    value: function writeFile(filePath, contents) {
      try {
        _fsExtra["default"].ensureDirSync(_path["default"].dirname(filePath));

        return _fsExtra["default"].writeFileSync(this.getFilePath(filePath), contents);
      } catch (e) {
        dd({
          msg: 'Error writing file',
          e: e
        });
      }
    }
  }, {
    key: "toJsonFile",
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
        })["catch"](reject);
      });
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.parseMain().then(function (json) {
          return resolve(json);
        })["catch"](reject);
      });
    }
  }, {
    key: "toYamlFile",
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
        })["catch"](reject);
      });
    }
  }, {
    key: "toYAML",
    value: function toYAML() {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        _this7.parseMain().then(function (json) {
          return resolve(YAML.safeDump(json, _this7.indentation));
        })["catch"](reject);
      });
    }
  }]);
  return Bundler;
}();

exports["default"] = Bundler;