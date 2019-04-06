"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 *
 * @param string
 * @returns {Array}
 */
exports.default = function (string) {
  if (string[0] === "'") string = string.substring(1, string.length);
  if (string[string.length - 1] === "'") string = string.substring(0, string.length - 1);
  string = string.trim();
  string = string.replace('mixin(', '');
  string = string.substring(0, string.length - 1);
  var paramsArray = [];
  var parts = string.split(',');
  parts.forEach(function (part) {
    var item = part.trim();
    var a = item[0] === "'" || item[0] === '"' ? 1 : 0;
    var b = item[item.length - 1] === "'" || item[item.length - 1] === '"' ? item.length - 1 : item.length - 0;
    item = item.substring(a, b);
    paramsArray.push(item);
  });
  return paramsArray;
};

module.exports = exports.default;