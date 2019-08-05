/* jshint node: true, esversion: 6 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const root = require('rootrequire');

const exec = filepath => {
  return new Promise((resolve, reject) => {
    spawn(process.execPath, ['--expose-gc', filepath], { stdio: 'inherit' })
    .on('exit', () => resolve())
    .on('error', err => reject(err));
  });
};

(async () => {
  const tests = fs.readdirSync(path.resolve(root, 'benchmarks'));

  for (let test of tests) {
    console.log('==============================================');
    console.log('TEST', test);

    const run = file => exec(path.resolve(root, 'benchmarks', test, file));
    const files = fs.readdirSync(path.resolve(root, 'benchmarks', test));

    if (files.includes('teardown.js')) {
      console.log('running cleanup');
      await run('teardown.js');
    }

    if (files.includes('setup.js')) {
      console.log('running setup');
      await run('setup.js');
    }

    const runs = files.filter(f => /^run/.test(f));

    for (let candidate of runs) {
      console.log('CANDIDATE', candidate);
      console.log('.....................');
      await run(candidate);
      console.log('.....................');
      await run(candidate);
      console.log('.....................');
      await run(candidate);
      console.log('----------------------------------------------');
    }
  }
})().then(() => console.log('finished')).catch(err => console.log('benchmark failed\n', err));
