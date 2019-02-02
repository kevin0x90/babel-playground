const utils = require('loader-utils');
const hogan = require('hogan.js');
const fs = require('fs');
const path = require('path');

const partialDir = 'C:\\Users\\k3v1n\\Documents\\babel-playground\\src\\templates';

function getPartials(source, partials) {
  const partialRegex = /\{\{>([\w/-]+)}\}/g;

  let partial;
  while (partial = partialRegex.exec(source)) {
    const partialName = partial[1];
    const fullPartialPath = path.join(partialDir, partialName + '.mustache');
    const partialContent = fs.readFileSync(fullPartialPath, 'utf-8');

    if (!partials[partialName]) {
      const compiledPartial = hogan.compile(partialContent, { asString: true });
      partials[partialName] = `new Hogan.Template(${compiledPartial})`;
    }

    partials = getPartials(partialContent, partials);
  }

  return partials;
}

function buildPartialsObjectString(compiledPartials) {
  let result = '{';
  for (const key in compiledPartials) {
     const value = compiledPartials[key];
     result += `'${key}': ${value},`;
  }
  result += '}';

  return result;
}

module.exports = function hoganLoader(source) {
  const loaderAsyncCallback = this.async();

  const compiledPartials = getPartials(source, {});
  const compiledTemplate = hogan.compile(source, { asString: true });
  const compiledPartialsObjectString = buildPartialsObjectString(compiledPartials);

  const result = `
    module.exports = {
      render: function (data) {
         var Hogan = require("hogan.js");
         return new Hogan.Template(${compiledTemplate})
          .render(data, ${compiledPartialsObjectString});
      }
    };`;

  loaderAsyncCallback(null, result);
};