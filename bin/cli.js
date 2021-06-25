#!/usr/bin/env node

var devMode = require('fs').existsSync(`${__dirname}/../src`);

if (!devMode) {
  require('../build/src/cli.js');
} else {
  console.log('Running in dev mode');

  const tsConfig = require('../tsconfig.json');
  const tsConfigPaths = require('tsconfig-paths');

  // this runs from the typescript source (for dev only)
  // hook into ts-node so we can run typescript on the fly
  const service = require('ts-node').register({
    project: `${__dirname}/../tsconfig.json`,
    compiler: 'ttypescript',
    compilerOptions: {
      plugins: tsConfig.compilerOptions.plugins
    }
  });

  const cleanup = tsConfigPaths.register({
    baseUrl: tsConfig.compilerOptions.baseUrl,
    paths: tsConfig.compilerOptions.paths,
  });

  // run the CLI with the current process arguments
  require(`${__dirname}/../src/cli`);
}
