'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var dd = require('../dd');

exports.default = function (object, applyFunction) {
  var walk = function walk(object, applyFunction) {
    if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
      for (var key in object) {
        if (_typeof(object[key]) === 'object') {
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