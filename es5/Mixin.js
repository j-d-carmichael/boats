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

var _functionParamsFromStr = require('./functionParamsFromStr');

var _functionParamsFromStr2 = _interopRequireDefault(_functionParamsFromStr);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _calculateIndentFromLineBreak = require('./calculateIndentFromLineBreak');

var _calculateIndentFromLineBreak2 = _interopRequireDefault(_calculateIndentFromLineBreak);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Mixin = function () {
  function Mixin() {
    (0, _classCallCheck3.default)(this, Mixin);
  }

  (0, _createClass3.default)(Mixin, [{
    key: 'injector',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(inputString, fileLocation, originalIndentation) {
        var mixinRegex, mixinStr, indent, replaceVal, linePadding, i;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log(fileLocation);
                mixinRegex = /'?(mixin\(.*\))'?/;
                mixinStr = inputString.match(mixinRegex);

                if (mixinStr) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', inputString);

              case 5:
                indent = (0, _calculateIndentFromLineBreak2.default)(inputString, mixinStr.index) + originalIndentation;
                replaceVal = '\n';
                linePadding = '';

                for (i = 0; i < indent; ++i) {
                  linePadding += ' ';
                }
                replaceVal += this.parser(mixinStr[0], fileLocation, linePadding);
                return _context.abrupt('return', inputString.replace(mixinStr[0], replaceVal));

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function injector(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return injector;
    }()
  }, {
    key: 'parser',
    value: function parser(val, currentFilePointer, linePadding) {
      if (typeof val === 'string' && val.indexOf('mixin(') !== -1) {
        var params = (0, _functionParamsFromStr2.default)(val);
        var mixinPath = '';
        var vars = {};
        params.forEach(function (param, i) {
          if (i > 0) {
            vars['var' + i] = param;
          } else {
            mixinPath = param;
          }
        });
        nunjucks.configure({ autoescape: false });
        var renderPath = _path2.default.join(_path2.default.dirname(currentFilePointer), mixinPath);
        if (!_fsExtra2.default.pathExistsSync(renderPath)) {
          throw new Error('Path not found when trying to render mixin: ' + renderPath);
        }
        var rendered = nunjucks.render(renderPath, vars);
        // inject the indentation
        var parts = rendered.split('\n');
        parts.forEach(function (part, i) {
          parts[i] = linePadding + part;
        });
        return parts.join('\n');
      }

      return val;
    }
  }]);
  return Mixin;
}();

exports.default = new Mixin();
module.exports = exports.default;