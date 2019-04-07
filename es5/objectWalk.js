"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var dd = require('../dd');

var _default = function _default(object, applyFunction) {
  var walk = function walk(object, applyFunction) {
    if ((0, _typeof2["default"])(object) === 'object') {
      for (var key in object) {
        if ((0, _typeof2["default"])(object[key]) === 'object') {
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

exports["default"] = _default;