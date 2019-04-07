'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Walker = require('walker');
var YAML = require('js-yaml');
var dd = require('../dd');

var UniqueOperationIds = function () {
  function UniqueOperationIds(program) {
    _classCallCheck(this, UniqueOperationIds);

    if (!program.input) {
      dd('No input provided');
    } else {
      if (!_fs2.default.existsSync(program.input)) {
        dd('File does not exist. (' + program.input + ')');
      }
    }
    this.input = _path2.default.dirname(program.input);
    this.stripValue = program.strip_value || 'src/paths/';
    this.indentation = program.indentation || 2;
  }

  _createClass(UniqueOperationIds, [{
    key: 'ucFirst',
    value: function ucFirst(s) {
      if (typeof s !== 'string') {
        return '';
      }
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }, {
    key: 'isYml',
    value: function isYml(filePath) {
      return ['yml', 'yaml'].indexOf(_path2.default.extname(filePath).substring(1)) !== -1;
    }
  }, {
    key: 'getUniqueOperationIdFromPath',
    value: function getUniqueOperationIdFromPath(filePath) {
      filePath = filePath.replace(this.stripValue, '');
      filePath = filePath.replace(_path2.default.extname(filePath), '');
      var filePathParts = filePath.split('/');
      for (var i = 0; i < filePathParts.length; ++i) {
        if (i !== 0) {
          filePathParts[i] = this.ucFirst(filePathParts[i]);
        }
      }
      return filePathParts.join('');
    }
  }, {
    key: 'readYmlToJson',
    value: function readYmlToJson(filePath) {
      return YAML.safeLoad(_fs2.default.readFileSync(filePath).toString());
    }
  }, {
    key: 'writeJsonToYaml',
    value: function writeJsonToYaml(filePath, json) {
      return _fs2.default.writeFileSync(filePath, YAML.safeDump(json, {
        indent: this.indentation,
        lineWidth: 1000,
        noCompatMode: true
      }));
    }
  }, {
    key: 'injectUniqueOperationId',
    value: function injectUniqueOperationId(filePath) {
      var uniqueOpId = this.getUniqueOperationIdFromPath(filePath);
      var json = this.readYmlToJson(filePath);
      if (json) {
        if (json.summary || json.description) {
          json.operationId = uniqueOpId;
        } else {
          for (var key in json) {
            if (json[key].summary || json[key].description) {
              json[key].operationId = uniqueOpId;
            }
          }
        }
        this.writeJsonToYaml(filePath, json);
      }
    }
  }, {
    key: 'listAndInject',
    value: function listAndInject() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        Walker(_this.input).on('file', function (file) {
          if (_this.isYml(file) && file.includes('paths/') && !file.includes('index')) {
            _this.injectUniqueOperationId(file);
          }
        }).on('error', function (err, entry) {
          console.log('Got error reading file: ' + entry);
          reject(err);
        }).on('end', function () {
          resolve();
        });
      });
    }
  }]);

  return UniqueOperationIds;
}();

exports.default = UniqueOperationIds;
module.exports = exports.default;