'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var nunjucks = _interopRequireWildcard(_nunjucks);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _UniqueOperationIds = require('./UniqueOperationIds');

var _UniqueOperationIds2 = _interopRequireDefault(_UniqueOperationIds);

var _calculateIndentFromLineBreak = require('./calculateIndentFromLineBreak');

var _calculateIndentFromLineBreak2 = _interopRequireDefault(_calculateIndentFromLineBreak);

var _cloneObject = require('./cloneObject');

var _cloneObject2 = _interopRequireDefault(_cloneObject);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Template = function () {
  function Template() {
    (0, _classCallCheck3.default)(this, Template);
  }

  (0, _createClass3.default)(Template, [{
    key: 'load',

    /**
     *
     * @param inputString The string to parse
     * @param fileLocation The file location the string derived from
     * @param originalIndentation The original indentation
     * @param stripValue The opid strip value
     * @param customVars Custom variables passed to nunjucks
     * @returns {Promise<*>}
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(inputString, fileLocation, originalIndentation, stripValue) {
        var customVars = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.currentFilePointer = fileLocation;
                this.originalIndentation = originalIndentation;
                this.stripValue = stripValue;
                this.mixinVarNamePrefix = 'var';
                this.mixinObject = this.setMixinPositions(inputString, originalIndentation);
                this.mixinNumber = 0;
                this.setMixinPositions(inputString, originalIndentation);
                this.nunjucksSetup(customVars);
                return _context.abrupt('return', nunjucks.render(fileLocation));

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function load(_x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
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
  }, {
    key: 'nunjucksSetup',
    value: function nunjucksSetup(customVars) {
      var env = nunjucks.configure({ autoescape: false });
      env.addGlobal('mixin', this.mixin);
      env.addGlobal('mixinNumber', this.mixinNumber);
      env.addGlobal('mixinObject', this.mixinObject);
      env.addGlobal('mixinVarNamePrefix', this.mixinVarNamePrefix);
      env.addGlobal('uniqueOpId', this.uniqueOpId);
      env.addGlobal('uniqueOpIdStripValue', this.stripValue);
      env.addGlobal('currentFilePointer', this.currentFilePointer);
      var processEnvVars = (0, _cloneObject2.default)(process.env);
      for (var key in processEnvVars) {
        env.addGlobal(key, processEnvVars[key]);
      }

      for (var _key in customVars) {
        env.addGlobal(_key, customVars[_key]);
      }
    }
  }, {
    key: 'uniqueOpId',
    value: function uniqueOpId() {
      return _UniqueOperationIds2.default.getUniqueOperationIdFromPath(this.env.globals.currentFilePointer, this.env.globals.uniqueOpIdStripValue);
    }
  }, {
    key: 'mixin',
    value: function mixin() {
      var tplGlobals = this.env.globals;
      var renderPath = _path2.default.join(_path2.default.dirname(tplGlobals.currentFilePointer), arguments[0]);
      if (!_fsExtra2.default.pathExistsSync(renderPath)) {
        throw new Error('Path not found when trying to render mixin: ' + renderPath);
      }
      var vars = {};
      for (var i = 1; i < arguments.length; ++i) {
        vars[tplGlobals.mixinVarNamePrefix + i] = arguments[i];
      }
      var replaceVal = '\n';
      var rendered = nunjucks.render(renderPath, vars);
      // inject the indentation
      var parts = rendered.split('\n');
      parts.forEach(function (part, i) {
        parts[i] = tplGlobals.mixinObject[tplGlobals.mixinNumber].mixinLinePadding + part;
      });
      ++this.env.globals.mixinNumber;
      return replaceVal + parts.join('\n');
    }
  }]);
  return Template;
}();

exports.default = new Template();
module.exports = exports.default;