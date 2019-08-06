/* jshint node: true, esversion: 6 */
const fs = require('fs');
const path = require('path');
const root = require('rootrequire');
const mkdirp = require('mkdirp');

const rand = () => Math.random().toString(36).slice(2);

const run = (directoryCount, fileCount) => {
  const dirs = [];
  for (let i = 0; i < directoryCount; i++) {
    const dir = rand();
    dirs.push(dir);
    mkdirp.sync(path.resolve(root, 'temp', dir));

    for (let j = 0; j < fileCount; j++) {
      fs.writeFileSync(path.resolve(root, 'temp', dir, `${rand()}.txt`), rand());
    }
  }
};

if (require.main === module) {
  run(400, 16);
} else {
  module.exports = run;
}
