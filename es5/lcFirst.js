'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param string to ucfirst
 * @returns {string}
 */
exports.default = function (string) {
  if (typeof string !== 'string') {
    throw new Error('Param passed to ucfirst is not type string but type: ' + (typeof string === 'undefined' ? 'undefined' : (0, _typeof3.default)(string)));
  }
  if (string.length === 0) {
    return string;
  }
  if (string.length === 1) {
    return string.toLocaleLowerCase();
  }
  return string.charAt(0).toLocaleLowerCase() + string.slice(1);
};

module.exports = exports.default;