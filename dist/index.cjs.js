'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupPluginutils = require('rollup-pluginutils');
var jsesc = _interopDefault(require('jsesc'));
var htmlMinifier = require('html-minifier');

function htmlPlugin(options) {
  if ( options === void 0 ) options = {};

  var filter = rollupPluginutils.createFilter(options.include || ['**/*.html', '**/*.htm'], options.exclude);
  var htmlMinifierOptions = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    conservativeCollapse: true,
    minifyJS: true
  };
  return {
    name: 'bqHtml',
    transform: function transform(code, id) {
      if (!filter(id)) {
        return null
      }
      var ngModule = options.module || 'ng';
      var html = JSON.stringify(htmlMinifier.minify(code, options.htmlMinifierOptions || htmlMinifierOptions ));
      var path = id.replace(process.cwd(), '');
      path = path.replace(/\\/g, '/'); // fix for Windows
      if(options.processPath){
        // optionally modify the path since they are relative to the repo root dir
        path = path.replace(options.processPath.find, options.processPath.replace);
      }
      var result = "var path = '" + (jsesc(path)) + "'; angular.module('" + ngModule + "').run(['$templateCache', function(tc){tc.put(path, " + html + ")}]); export default path;";
      return {
        code: result,
        map: {
          mappings: ''
        }
      }
    }
  }
}

module.exports = htmlPlugin;
