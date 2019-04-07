'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var nunjucks = _interopRequireWildcard(_nunjucks);

var _functionParamsFromStr = require('./functionParamsFromStr');

var _functionParamsFromStr2 = _interopRequireDefault(_functionParamsFromStr);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _calculateIndentFromLineBreak = require('./calculateIndentFromLineBreak');

var _calculateIndentFromLineBreak2 = _interopRequireDefault(_calculateIndentFromLineBreak);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mixin = function () {
  function Mixin() {
    _classCallCheck(this, Mixin);
  }

  _createClass(Mixin, [{
    key: 'injector',
    value: function injector(inputString, fileLocation, originalIndentation) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        try {
          var mixinRegex = /'?(mixin\(.*\))'?/;
          var mixinStr = inputString.match(mixinRegex);
          if (!mixinStr) {
            return resolve(inputString);
          }
          var indent = (0, _calculateIndentFromLineBreak2.default)(inputString, mixinStr.index) + originalIndentation;
          var replaceVal = '\n';
          var linePadding = '';
          for (var i = 0; i < indent; ++i) {
            linePadding += ' ';
          }
          replaceVal += _this.parser(mixinStr[0], fileLocation, linePadding);
          return resolve(inputString.replace(mixinStr[0], replaceVal));
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: 'parser',
    value: function parser(val, currentFilePointer, linePadding) {
      if (typeof val === 'string' && val.indexOf('mixin(') !== -1) {
        var params = (0, _functionParamsFromStr2.default)(val);
        var mixinPath = '';
        var vars = {};
        params.forEach(function (param, i) {
          if (i > 0) {
            vars['var' + i] = param;
          } else {
            mixinPath = param;
          }
        });
        nunjucks.configure({ autoescape: false });
        var renderPath = _path2.default.join(_path2.default.dirname(currentFilePointer), mixinPath);
        if (!_fsExtra2.default.pathExistsSync(renderPath)) {
          throw new Error('Path not found when trying to render mixin: ' + renderPath);
        }
        var rendered = nunjucks.render(renderPath, vars);
        // inject the indentation
        var parts = rendered.split('\n');
        parts.forEach(function (part, i) {
          parts[i] = linePadding + part;
        });
        return parts.join('\n');
      }

      return val;
    }
  }]);

  return Mixin;
}();

exports.default = new Mixin();
module.exports = exports.default;