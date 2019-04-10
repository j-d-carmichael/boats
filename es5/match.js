'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regexp = /t(e)(st(\d?))/g;
var str = 'test1test2';

var array = [].concat((0, _toConsumableArray3.default)(str.matchAll(regexp)));

console.log(array);
// expected output: Array ["test1", "e", "st1", "1"]