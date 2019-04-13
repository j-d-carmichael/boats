'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileName = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('../commander');

var program = _interopRequireWildcard(_commander);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getVersion = function getVersion(jsonObj, appendVersion) {
  var swagVersion = '';
  if (!appendVersion) {
    return swagVersion;
  }
  if (jsonObj.info.version) {
    swagVersion = jsonObj.info.version;
  } else if (!program.Version) {
    var packageJson = void 0;
    try {
      packageJson = JSON.parse(_fsExtra2.default.readFileSync('./package.json'));
    } catch (e) {
      packageJson = {};
    }
    if (packageJson.version) {
      swagVersion = packageJson.version;
    } else {
      return swagVersion;
    }
  }
  return '_' + swagVersion;
};

var getFileName = exports.getFileName = function getFileName(filePath, openApiJson, appendVersion) {
  var name = _path2.default.basename(filePath).replace(_path2.default.extname(filePath), '');
  return name + getVersion(openApiJson, appendVersion) + _path2.default.extname(filePath);
};

exports.default = function (filePath, openApiJson, appendVersion) {
  return _path2.default.join(_path2.default.dirname(filePath), getFileName(filePath, openApiJson, appendVersion));
};