/* jshint node: true, esversion: 6 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');

const pretty = require('pretty-bytes');
const countFiles = promisify(require('count-files'));
const mkdirp = require('mkdirp');
const root = require('rootrequire');
const pkg = require(`${root}/package.json`);

module.exports = async name => {
  const dir = path.resolve(root, 'temp', `project-${name}`);
  mkdirp.sync(dir);
  fs.writeFileSync(path.resolve(dir, 'package.json'), JSON.stringify({
    name: `project-${name}`,
    dependencies: {
      [`${name}`]: pkg.dependencies[name]
    }
  }));

  execSync('npm install', { cwd: dir, stdio: 'inherit' });

  const result = await countFiles(path.resolve(dir, 'node_modules'));

  const output = require('../../lib/output.js');

  output({
    directories: result.dirs,
    files: result.files,
    size: result.bytes,
    'size:human': pretty(result.bytes)
  });
};
