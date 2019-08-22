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

const benchmarkFilters = process.argv.slice(2);

const start = Date.now();
(async () => {
  console.log(`${process.platform}, ${os.cpus()[0].model.trim()}, ${os.cpus()[0].speed}, ${os.cpus().length} cores`);
  const tests = fs.readdirSync(path.resolve(root, 'benchmarks')).filter(name => {
    if (benchmarkFilters.length === 0) {
      return true;
    }

    if (benchmarkFilters.includes(name)) {
      return true;
    }

    console.log(chalk.yellow(`skipping ${name} benchmark`));
    return false;
  });

  for (let test of tests) {
    console.log(chalk.gray('=============================================='));
    console.log(chalk.bold(`TEST ${test}`));

    const run = file => exec(path.resolve(root, 'benchmarks', test, file));
    const silent = file => exec(path.resolve(root, 'benchmarks', test, file), 'ignore');
    const files = fs.readdirSync(path.resolve(root, 'benchmarks', test));

    const def = require(path.resolve(root, 'benchmarks', test, 'definition.js'));

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

      if (def.silentCount > 0) {
        // perform a silent run first, just in case
        await silent(candidate);
      }

      if (def.preCount > 0) {
        console.log(chalk.yellow(`CANDIDATE PRE-RUN ${candidate}, ${test}`));

        for (let i = 0; i < def.preCount; i++) {
          console.log(chalk.gray('.....................'));
          await run(candidate);
        }

        console.log(chalk.gray('----------------------------------------------'));
      }
    }

    for (let candidate of runs) {
      if (def.count > 0) {
        console.log(chalk.yellow(`CANDIDATE RUN ${candidate}, ${test}`));

        for (let i = 0; i < def.count; i++) {
          console.log(chalk.gray('.....................'));
          const [color, reset] = chalk.cyan('|').split('|');
          process.stdout.write(color);
          await run(candidate);
          process.stdout.write(reset);
          console.log(chalk.gray('----------------------------------------------'));
        }
      }
    }

    if (def.teardown) {
      await def.teardown();
    }
  }
})()
.then(() => console.log(`finished in ${Date.now() - start}ms`))
.catch(err => console.log(`benchmark failed in ${Date.now() - start}ms\n`, err));
