"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Clones an object and returns
 */
exports.default = function (obj) {
  return JSON.parse((0, _stringify2.default)(obj));
};

module.exports = exports.default;