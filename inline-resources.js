// tslint:disable:no-eval
const { dirname, join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const glob = require('glob').sync

/** Finds all JavaScript files in a directory and inlines all resources of Angular components. */
function inlineResourcesForDirectory(folderPath) {
  glob(join(folderPath, '**/*.js')).forEach(filePath => inlineResources(filePath));
}

/** Inlines the external resources of Angular components of a file. */
function inlineResources(filePath) {
  let fileContent = readFileSync(filePath, 'utf-8');

  fileContent = inlineTemplate(fileContent, filePath);
  fileContent = inlineStyles(fileContent, filePath);
  fileContent = removeModuleId(fileContent);

  writeFileSync(filePath, fileContent, 'utf-8');
}

/** Inlines the templates of Angular components for a specified source file. */
function inlineTemplate(fileContent, filePath) {
  return fileContent.replace(/templateUrl:\s*'([^']+?\.html)'/g, (_match, templateUrl) => {
    const templatePath = join(dirname(filePath), templateUrl);
    const templateContent = loadResourceFile(templatePath);
    return `template: "${templateContent}"`;
  });
}

/** Inlines the external styles of Angular components for a specified source file. */
function inlineStyles(fileContent, filePath) {
  return fileContent.replace(/styleUrls:\s*(\[[\s\S]*?])/gm, (_match, styleUrlsValue) => {
    // The RegExp matches the array of external style files. This is a string right now and
    // can to be parsed using the `eval` method. The value looks like "['AAA.css', 'BBB.css']"
    const styleUrls = eval(styleUrlsValue)

    const styleContents = styleUrls
      .map(url => {
        const arr = url.split('.')

        arr.pop()
        arr.push('css')

        return arr.join('.')
      })
      .map(url => join(dirname(filePath), url))
      .map(path => loadResourceFile(path));

    return `styles: ["${styleContents.join(' ')}"]`;
  });
}

/** Remove every mention of `moduleId: module.id` */
function removeModuleId(fileContent) {
  return fileContent.replace(/\s*moduleId:\s*module\.id\s*,?\s*/gm, '');
}

/** Loads the specified resource file and drops line-breaks of the content. */
function loadResourceFile(filePath) {
  return readFileSync(filePath, 'utf-8')
    .replace(/([\n\r]\s*)+/gm, ' ')
    .replace(/"/g, '\\"');
}

module.exports = {
  inlineResourcesForDirectory
}
