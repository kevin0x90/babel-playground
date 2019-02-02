const hogan = require('hogan.js');
const fs = require('fs');
const path = require('path');

const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');

function getCompiledPartialString(partialContent) {
  const compiledPartial = hogan.compile(partialContent, { asString: true });
  return `new Hogan.Template(${compiledPartial})`;
}

function getPartialContent(partialDir, partialName, fileExtension, loaderContext) {
  const fullPartialPath = path.join(partialDir, `${partialName}${fileExtension}`);
  loaderContext.addDependency(fullPartialPath);

  return fs.readFileSync(fullPartialPath, 'utf-8');
}

function getPartials(source, options, loaderContext) {
  const partialRegex = /\{\{>([\w/-]+)}\}/g;
  const remaining = [source];
  const partials = {};

  while (remaining.length > 0) {
    const currentContent = remaining.pop();

    let partial;
    while (partial = partialRegex.exec(currentContent)) {
      const partialName = partial[1];
      const partialContent = getPartialContent(options.partialsDir, partialName, options.fileExtension, loaderContext);

      remaining.push(partialContent);
      if (!partials[partialName]) {
        partials[partialName] = getCompiledPartialString(partialContent);
      }
    }
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

function getCompiledTemplateModuleExportString(compiledTemplate, compiledPartialsObjectString) {
  const result = `
    module.exports = {
      render: function (data) {
         var Hogan = require("hogan.js");
         return new Hogan.Template(${compiledTemplate})
          .render(data, ${compiledPartialsObjectString});
      }
    };`;

  return result;
}

const optionsSchema = {
  type: 'object',
  properties: {
    partialsDir: {
      type: 'string'
    },
    fileExtension: {
      type: 'string'
    }
  }
};

module.exports = function hoganLoader(source) {
  const loaderContext = this;
  const options = loaderUtils.getOptions(loaderContext);
  validateOptions(optionsSchema, options, 'hogan-loader');

  const loaderAsyncCallback = this.async();

  const compiledPartials = getPartials(source, options, loaderContext);
  const compiledPartialsObjectString = buildPartialsObjectString(compiledPartials);

  const compiledTemplate = hogan.compile(source, { asString: true });
  loaderAsyncCallback(null, getCompiledTemplateModuleExportString(compiledTemplate, compiledPartialsObjectString));
};