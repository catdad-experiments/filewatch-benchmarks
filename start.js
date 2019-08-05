/* jshint node: true, esversion: 6 */
const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const root = require('rootrequire');
const chalk = require('chalk');

const exec = (filepath, stdio = 'inherit') => {
  return new Promise((resolve, reject) => {
    spawn(process.execPath, ['--expose-gc', filepath], { stdio })
    .on('exit', () => resolve())
    .on('error', err => reject(err));
  });
};

(async () => {
  console.log(`${process.platform}, ${os.cpus()[0].model}, ${os.cpus().length} cores`);
  const tests = fs.readdirSync(path.resolve(root, 'benchmarks'));

  for (let test of tests) {
    console.log(chalk.gray('=============================================='));
    console.log(chalk.bold(`TEST ${test}`));

    const run = file => exec(path.resolve(root, 'benchmarks', test, file));
    const silent = file => exec(path.resolve(root, 'benchmarks', test, file), 'ignore');
    const files = fs.readdirSync(path.resolve(root, 'benchmarks', test));

    if (files.includes('teardown.js')) {
      console.log(chalk.gray('running cleanup'));
      await run('teardown.js');
    }

    if (files.includes('setup.js')) {
      console.log(chalk.gray('running setup'));
      await run('setup.js');
    }

    console.log(chalk.gray('----------------------------------------------'));

    const runs = files.filter(f => /^run/.test(f));

    for (let candidate of runs) {
      console.log(chalk.yellow(`CANDIDATE ${candidate}`));
      // perform a silent run first, just in case
      await silent(candidate);
      console.log(chalk.gray('.....................'));
      await run(candidate);
      console.log(chalk.gray('.....................'));
      await run(candidate);
      console.log(chalk.gray('.....................'));
      await run(candidate);
      console.log(chalk.gray('----------------------------------------------'));
    }

    if (files.includes('teardown.js')) {
      console.log(chalk.gray('running cleanup'));
      await run('teardown.js');
    }
  }
})().then(() => console.log('finished')).catch(err => console.log('benchmark failed\n', err));
