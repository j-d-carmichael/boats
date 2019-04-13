'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var YAML = _interopRequireWildcard(_jsYaml);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(inputFile, outputFile) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var indentation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
    var SwaggerParser, bundled, contents;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            SwaggerParser = require('swagger-parser');
            _context.next = 3;
            return SwaggerParser.bundle(inputFile, options);

          case 3:
            bundled = _context.sent;
            contents = void 0;

            if (_path2.default.extname(outputFile) === '.json') {
              contents = (0, _stringify2.default)(bundled, null, indentation);
            } else {
              contents = YAML.safeDump(bundled, indentation);
            }
            _fsExtra2.default.ensureDirSync(_path2.default.dirname(outputFile));
            return _context.abrupt('return', _fsExtra2.default.writeFileSync(outputFile, contents));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = exports.default;