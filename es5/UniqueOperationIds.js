'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ucFirst = require('./ucFirst');

var _ucFirst2 = _interopRequireDefault(_ucFirst);

var _lcFirst = require('./lcFirst');

var _lcFirst2 = _interopRequireDefault(_lcFirst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UniqueOperationIds = function () {
  function UniqueOperationIds() {
    (0, _classCallCheck3.default)(this, UniqueOperationIds);
  }

  (0, _createClass3.default)(UniqueOperationIds, [{
    key: 'getUniqueOperationIdFromPath',

    /**
     *
     * @param filePath
     * @param stripValue
     * @param cwd
     * @returns {string}
     */
    value: function getUniqueOperationIdFromPath(filePath, stripValue, cwd) {
      cwd = cwd || process.cwd();
      filePath = filePath.replace(cwd, '');
      filePath = this.removeFileExtension(filePath.replace(stripValue, ''));
      var filePathParts = filePath.split('/');
      for (var i = 0; i < filePathParts.length; ++i) {
        if (i !== 0) {
          filePathParts[i] = (0, _ucFirst2.default)(filePathParts[i]);
        }
      }
      return (0, _lcFirst2.default)(filePathParts.join(''));
    }

    /**
     *
     * @param filePath
     * @returns {*|void|string|never}
     */

  }, {
    key: 'removeFileExtension',
    value: function removeFileExtension(filePath) {
      return filePath.replace(_path2.default.extname(filePath), '');
    }
  }]);
  return UniqueOperationIds;
}();

exports.default = new UniqueOperationIds();
module.exports = exports.default;