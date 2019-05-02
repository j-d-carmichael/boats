'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var nunjucks = _interopRequireWildcard(_nunjucks);

var _walker = require('walker');

var _walker2 = _interopRequireDefault(_walker);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _calculateIndentFromLineBreak = require('./calculateIndentFromLineBreak');

var _calculateIndentFromLineBreak2 = _interopRequireDefault(_calculateIndentFromLineBreak);

var _cloneObject = require('./cloneObject');

var _cloneObject2 = _interopRequireDefault(_cloneObject);

var _defaults = require('./defaults');

var defaults = _interopRequireWildcard(_defaults);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Template = function () {
  function Template() {
    (0, _classCallCheck3.default)(this, Template);
  }

  (0, _createClass3.default)(Template, [{
    key: 'directoryParse',

    /**
     * Parses all files in a folder against the nunjuck tpl engine and outputs in a mirrored path the in provided outputDirectory
     * @param inputFile The input directory to start parsing from
     * @param output The directory to output/mirror to
     * @param originalIndent The original indent (currently hard coded to 2)
     * @param stripValue The strip value for the uniqueOpIp
     * @param variables The variables for the tpl engine
     * @param helpFunctionPaths Array of fully qualified local file paths to nunjucks helper functions
     * @param boatsrc
     */
    value: function directoryParse(inputFile, output) {
      var originalIndent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaults.DEFAULT_ORIGINAL_INDENTATION;
      var stripValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaults.DEFAULT_STRIP_VALUE;
      var variables = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      var _this = this;

      var helpFunctionPaths = arguments[5];
      var boatsrc = arguments[6];

      return new _promise2.default(function (resolve, reject) {
        if (!inputFile || !output) {
          throw new Error('You must pass an input file and output directory when parsing multiple files.');
        }
        inputFile = _this.cleanInputString(inputFile);
        var returnFileinput = void 0;
        (0, _walker2.default)(_path2.default.dirname(inputFile)).on('file', function () {
          var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file) {
            var outputFile, rendered;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    outputFile = _this.calculateOutputFile(inputFile, file, _path2.default.dirname(output));
                    _context.next = 3;
                    return _this.load(_fsExtra2.default.readFileSync(file, 'utf8'), file, originalIndent, stripValue, variables, helpFunctionPaths, boatsrc);

                  case 3:
                    rendered = _context.sent;

                    if (inputFile === file) {
                      returnFileinput = outputFile;
                    }
                    _fsExtra2.default.outputFileSync(outputFile, rendered);

                  case 6:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this);
          }));

          return function (_x4) {
            return _ref.apply(this, arguments);
          };
        }()).on('error', function (er, entry) {
          reject(er + ' on entry ' + entry);
        }).on('end', function () {
          resolve(returnFileinput);
        });
      });
    }

    /**
     * Cleans the input string to ensure a match with the walker package when mirroring
     * @param relativeFilePath
     * @returns {string|*}
     */

  }, {
    key: 'cleanInputString',
    value: function cleanInputString(relativeFilePath) {
      if (relativeFilePath.substring(0, 2) === './') {
        return relativeFilePath.substring(2, relativeFilePath.length);
      }
      if (relativeFilePath.substring(0, 1) === '/') {
        return relativeFilePath.substring(1, relativeFilePath.length);
      }
      return relativeFilePath;
    }

    /**
     * Calculates the output file based on the input file, used for mirroring the input src dir
     * @param inputFile
     * @param currentFile
     * @param outputDirectory
     * @returns {*}
     */

  }, {
    key: 'calculateOutputFile',
    value: function calculateOutputFile(inputFile, currentFile, outputDirectory) {
      var inputDir = _path2.default.dirname(inputFile);
      return _path2.default.join(process.cwd(), outputDirectory, currentFile.replace(inputDir, ''));
    }

    /**
     * Loads and renders a tpl file
     * @param inputString The string to parse
     * @param fileLocation The file location the string derived from
     * @param originalIndentation The original indentation
     * @param stripValue The opid strip value
     * @param customVars Custom variables passed to nunjucks
     * @param helpFunctionPaths
     * @param boatsrc Fully qualified path to .boatsrc file
     * @returns {Promise<*>}
     */

  }, {
    key: 'load',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(inputString, fileLocation) {
        var originalIndentation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
        var stripValue = arguments[3];
        var customVars = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
        var helpFunctionPaths = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
        var boatsrc = arguments[6];
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.currentFilePointer = fileLocation;
                this.originalIndentation = originalIndentation;
                this.stripValue = stripValue;
                this.mixinVarNamePrefix = defaults.DEFAULT_MIXIN_VAR_PREFIX;
                this.mixinObject = this.setMixinPositions(inputString, originalIndentation);
                this.mixinNumber = 0;
                this.setMixinPositions(inputString, originalIndentation);
                this.nunjucksSetup(customVars, helpFunctionPaths, boatsrc);
                _context2.prev = 8;
                return _context2.abrupt('return', nunjucks.render(fileLocation));

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2['catch'](8);

                console.error('Error parsing nunjucks file ' + fileLocation + ': ');
                console.error(_context2.t0);
                process.exit(0);

              case 17:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[8, 12]]);
      }));

      function load(_x8, _x9) {
        return _ref2.apply(this, arguments);
      }

      return load;
    }()

    /**
     *
     * @param str The string to look for mixins
     * @param originalIndentation The original indentation setting, defaults to 2
     * @returns {Array}
     */

  }, {
    key: 'setMixinPositions',
    value: function setMixinPositions(str, originalIndentation) {
      var regexp = RegExp(/(mixin\(.*\))/, 'g');
      var matches = void 0;
      var matched = [];
      while ((matches = regexp.exec(str)) !== null) {
        var mixinObj = {
          index: regexp.lastIndex,
          match: matches[0],
          mixinLinePadding: ''
        };
        var indent = (0, _calculateIndentFromLineBreak2.default)(str, mixinObj.index) + originalIndentation;
        for (var i = 0; i < indent; ++i) {
          mixinObj.mixinLinePadding += ' ';
        }
        matched.push(mixinObj);
      }
      return matched;
    }

    /**
     * Tries to inject the provided json from a .boatsrc file
     * @param boatsrc
     * @returns {{autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string, commentEnd: string, blockEnd: string}}|({autoescape: boolean, tags: {blockStart: string, commentStart: string, variableEnd: string, variableStart: string, commentEnd: string, blockEnd: string}} & Template.nunjucksOptions)}
     */

  }, {
    key: 'nunjucksOptions',
    value: function nunjucksOptions() {
      var boatsrc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var baseOptions = {
        autoescape: false,
        tags: {
          blockStart: '<%',
          blockEnd: '%>',
          variableStart: '<$',
          variableEnd: '$>',
          commentStart: '{#',
          commentEnd: '#}'
        }
      };
      try {
        var json = _fsExtra2.default.readJsonSync(boatsrc);
        if (json.nunjucksOptions) {
          return (0, _assign2.default)(baseOptions, json.nunjucksOptions);
        }
      } catch (e) {
        return baseOptions;
      }
    }

    /**
     * Sets up the tpl engine for the current file being rendered
     * @param customVars
     * @param helpFunctionPaths
     * @param boatsrc Exact path to a .boatsrc file
     */

  }, {
    key: 'nunjucksSetup',
    value: function nunjucksSetup() {
      var customVars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _this2 = this;

      var helpFunctionPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var boatsrc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      var env = nunjucks.configure(this.nunjucksOptions(boatsrc));
      env.addGlobal('mixin', require('../nunjucksHelpers/mixin'));
      env.addGlobal('mixinNumber', this.mixinNumber);
      env.addGlobal('mixinObject', this.mixinObject);
      env.addGlobal('mixinVarNamePrefix', this.mixinVarNamePrefix);

      env.addGlobal('packageJson', require('../nunjucksHelpers/packageJson'));

      env.addGlobal('uniqueOpId', require('../nunjucksHelpers/uniqueOpId'));
      env.addGlobal('uniqueOpIdStripValue', this.stripValue);
      env.addGlobal('currentFilePointer', this.currentFilePointer);

      var processEnvVars = (0, _cloneObject2.default)(process.env);
      for (var key in processEnvVars) {
        env.addGlobal(key, processEnvVars[key]);
      }
      customVars.forEach(function (varObj) {
        var keys = (0, _keys2.default)(varObj);
        env.addGlobal(keys[0], varObj[keys[0]]);
      });
      helpFunctionPaths.forEach(function (filePath) {
        env.addGlobal(_this2.getHelperFunctionNameFromPath(filePath), require(filePath));
      });
    }

    /**
     * Returns an alpha numeric underscore helper function name
     * @param filePath
     */

  }, {
    key: 'getHelperFunctionNameFromPath',
    value: function getHelperFunctionNameFromPath(filePath) {
      return _path2.default.basename(filePath, _path2.default.extname(filePath)).replace(/[^0-9a-z_]/gi, '');
    }
  }]);
  return Template;
}();

exports.default = new Template();
module.exports = exports.default;