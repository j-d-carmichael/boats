'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dd = require('../dd');

exports.default = function (object, applyFunction) {
  var walk = function walk(object, applyFunction) {
    if ((typeof object === 'undefined' ? 'undefined' : (0, _typeof3.default)(object)) === 'object') {
      for (var key in object) {
        if ((0, _typeof3.default)(object[key]) === 'object') {
          object[key] = walk(object[key], applyFunction);
        } else {
          object[key] = applyFunction(object[key]);
        }
      }
      return object;
    } else {
      // handle error
      dd('Non object passed to objectWalk');
    }
  };
  return walk(object, applyFunction);
};

module.exports = exports.default;