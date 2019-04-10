'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Template = require('./Template');

var _Template2 = _interopRequireDefault(_Template);

var _commander = require('commander');

var program = _interopRequireWildcard(_commander);

var _jsYaml = require('js-yaml');

var YAML = _interopRequireWildcard(_jsYaml);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resolveRefs = require('json-refs').resolveRefs;
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
    (0, _classCallCheck3.default)(this, Bundler);

    if (!program.input) {
      dd('No input provided');
    } else {
      if (!_fsExtra2.default.existsSync(program.input)) {
        dd('File does not exist. (' + program.input + ')');
      }
    }
    this.strip_value = program.strip_value || 'paths/';
    this.mainJSON = '';
    this.appendVersion = program.exclude_version !== true;
    this.input = program.input;
    this.validate = program.validate === 'on';
    this.output = program.output || false;
    this.indentation = program.indentation || 2;
    this.originalIndentation = program.originalIndentation || 2;
    this.variables = program.variables || {};
  }

  (0, _createClass3.default)(Bundler, [{
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
          processContent: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(res, callback) {
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return _Template2.default.load(res.text, res.location, _this.originalIndentation, _this.strip_value, _this.variables);

                    case 3:
                      res.text = _context.sent;

                      callback(null, YAML.safeLoad(res.text));
                      _context.next = 10;
                      break;

                    case 7:
                      _context.prev = 7;
                      _context.t0 = _context['catch'](0);

                      dd({
                        msg: 'Error parsing yml',
                        e: _context.t0
                      });

                    case 10:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this, [[0, 7]]);
            }));

            function processContent(_x2, _x3) {
              return _ref.apply(this, arguments);
            }

            return processContent;
          }()
        }
      };
    }
  }, {
    key: 'parseMainRoot',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var renderedIndex;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _Template2.default.load(_fsExtra2.default.readFileSync(this.input).toString(), this.input, this.originalIndentation, this.strip_value, this.variables);

              case 2:
                renderedIndex = _context2.sent;
                return _context2.abrupt('return', YAML.safeLoad(renderedIndex));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function parseMainRoot() {
        return _ref2.apply(this, arguments);
      }

      return parseMainRoot;
    }()
  }, {
    key: 'parseMain',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var root, pwd, results;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.parseMainRoot();

              case 2:
                root = _context3.sent;
                pwd = process.cwd();

                process.chdir(_path2.default.dirname(this.input));
                _context3.next = 7;
                return resolveRefs(root, this.parseMainLoaderOptions());

              case 7:
                results = _context3.sent;

                this.mainJSON = results.resolved;
                _context3.next = 11;
                return this.validator();

              case 11:
                process.chdir(pwd);
                return _context3.abrupt('return', this.mainJSON);

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function parseMain() {
        return _ref3.apply(this, arguments);
      }

      return parseMain;
    }()
  }, {
    key: 'validator',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var SwaggerParser;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.validate) {
                  _context4.next = 4;
                  break;
                }

                SwaggerParser = require('swagger-parser');
                _context4.next = 4;
                return SwaggerParser.validate(this.cloneObject(this.mainJSON), {});

              case 4:
                return _context4.abrupt('return', true);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function validator() {
        return _ref4.apply(this, arguments);
      }

      return validator;
    }()
  }, {
    key: 'cloneObject',
    value: function cloneObject(src) {
      return JSON.parse((0, _stringify2.default)(src));
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
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(filePath) {
        var jsonString;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.output = filePath || false;
                _context5.next = 3;
                return this.toJSON();

              case 3:
                jsonString = (0, _stringify2.default)(this.mainJSON, null, this.indentation);

                if (this.output) {
                  _context5.next = 7;
                  break;
                }

                console.log(jsonString);
                return _context5.abrupt('return', true);

              case 7:
                this.writeFile(filePath, jsonString);
                console.log('File written to: ' + this.getFilePath(filePath));
                return _context5.abrupt('return', jsonString);

              case 10:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function toJsonFile(_x4) {
        return _ref5.apply(this, arguments);
      }

      return toJsonFile;
    }()
  }, {
    key: 'toJSON',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.parseMain();

              case 2:
                return _context6.abrupt('return', _context6.sent);

              case 3:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function toJSON() {
        return _ref6.apply(this, arguments);
      }

      return toJSON;
    }()
  }, {
    key: 'toYamlFile',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(filePath) {
        var yml;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                this.output = filePath || false;
                _context7.next = 3;
                return this.toYAML();

              case 3:
                yml = _context7.sent;

                if (this.output) {
                  _context7.next = 7;
                  break;
                }

                console.log(yml);
                return _context7.abrupt('return', true);

              case 7:
                this.writeFile(filePath, yml);
                console.log('File written to: ' + this.getFilePath(filePath));
                return _context7.abrupt('return', true);

              case 10:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function toYamlFile(_x5) {
        return _ref7.apply(this, arguments);
      }

      return toYamlFile;
    }()
  }, {
    key: 'toYAML',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var json;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.parseMain();

              case 2:
                json = _context8.sent;
                return _context8.abrupt('return', YAML.safeDump(json, this.indentation));

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function toYAML() {
        return _ref8.apply(this, arguments);
      }

      return toYAML;
    }()
  }]);
  return Bundler;
}();

exports.default = Bundler;
module.exports = exports.default;