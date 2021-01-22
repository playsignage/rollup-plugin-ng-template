import { createFilter } from 'rollup-pluginutils';
import jsesc from 'jsesc';
import { minify } from 'html-minifier';

function htmlPlugin(options) {
  if ( options === void 0 ) options = {};

  var filter = createFilter(options.include || ['**/*.html', '**/*.htm'], options.exclude);
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
      var html = JSON.stringify(minify(code, options.htmlMinifierOptions || htmlMinifierOptions ));
      var path = id.replace(process.cwd(), '');
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

export default htmlPlugin;
