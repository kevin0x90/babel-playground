const utils = require('loader-utils');
const hogan = require('hogan.js');
const fs = require('fs');

module.exports = function hoganLoader(source) {
  const loaderAsyncCallback = this.async();

  const compiledTemplate = hogan.compile(source, { asString: true });

  console.log(compiledTemplate);

  const result = 'module.exports = (function () {' +
         'var Hogan = require("hogan.js");' +
         'return new Hogan.Template(' + compiledTemplate + ');' +
         '})();';

  loaderAsyncCallback(null, result);
};