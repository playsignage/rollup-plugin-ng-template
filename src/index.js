import {createFilter} from 'rollup-pluginutils'
import jsesc from 'jsesc'
import {minify} from 'html-minifier'

export default function htmlPlugin(options = {}) {
  const filter = createFilter(options.include || ['**/*.html', '**/*.htm'], options.exclude)
  let htmlMinifierOptions = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    conservativeCollapse: true,
    minifyJS: true
  }
  return {
    name: 'bqHtml',
    transform(code, id) {
      if (!filter(id)) {
        return null
      }
      let ngModule = options.module || 'ng'
      let html = JSON.stringify(minify(code, options.htmlMinifierOptions || htmlMinifierOptions ))
      let path = id.replace(process.cwd(), '');
      if(options.processPath){
        // optionally modify the path since they are relative to the repo root dir
        path = path.replace(options.processPath.find, options.processPath.replace);
      }
      let result = `var path = '${jsesc(path)}'; angular.module('${ngModule}').run(['$templateCache', function(tc){tc.put(path, ${html})}]); export default path;`
      return {
        code: result,
        map: {
          mappings: ''
        }
      }
    }
  }
}
