'use strict';

var outDir = 'build/'

module.exports = {
  proxyHost: 'localhost',
  nodePort: 9001,
  syncPort: 3020,
  openBrowser: 'external',

  // app directories
  appDir: 'app',
  serverDir: 'server',

  // build directories
  buildDir: outDir + 'app/',
  buildCss: outDir + 'app/css/',
  buildFonts: outDir + 'app/fonts/',
  buildImages: outDir + 'app/images/',
  buildJs: outDir + 'app/js/',
  extDir: outDir + 'app/vendor/',
  extCss: outDir + 'app/vendor/css/',
  extFonts: outDir + 'app/vendor/fonts/',
  extJs: outDir + 'app/vendor/js/',

  // server build directories
  serverBuildDir: outDir + 'server/'
};
