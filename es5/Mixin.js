"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var nunjucks = _interopRequireWildcard(require("nunjucks"));

var _functionParamsFromStr = _interopRequireDefault(require("./functionParamsFromStr"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var Mixin =
/*#__PURE__*/
function () {
  function Mixin() {
    (0, _classCallCheck2["default"])(this, Mixin);
  }

  (0, _createClass2["default"])(Mixin, [{
    key: "injector",
    value: function injector(inputString, fileLocation, originalIndentation) {
      var mixinRegex = /'?(mixin\(.*\))'?/;
      var mixinStr = inputString.match(mixinRegex);

      if (!mixinStr) {
        return inputString;
      }

      var indent = calculateIndentFromLineBreak(inputString, mixinStr.index) + originalIndentation;
      var replaceVal = "\n";
      var linePadding = '';

      for (var i = 0; i < indent; ++i) {
        linePadding += ' ';
      }

      replaceVal += this.parser(mixinStr[0], fileLocation, linePadding);
      return inputString.replace(mixinStr[0], replaceVal);
    }
  }, {
    key: "parser",
    value: function parser(val, currentFilePointer, linePadding) {
      if (typeof val === 'string' && val.indexOf('mixin(') !== -1) {
        var params = (0, _functionParamsFromStr["default"])(val);
        var mixinPath = '';
        var vars = {};
        params.forEach(function (param, i) {
          if (i > 0) {
            vars['var' + i] = param;
          } else {
            mixinPath = param;
          }
        });
        nunjucks.configure({
          autoescape: false
        });

        var renderPath = _path["default"].join(_path["default"].dirname(currentFilePointer), mixinPath);

        if (!_fsExtra["default"].pathExistsSync(renderPath)) {
          throw new Error('Path not found when trying to render mixin: ' + renderPath);
        }

        var rendered = nunjucks.render(renderPath, vars); // inject the indentation

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

var _default = new Mixin();

exports["default"] = _default;