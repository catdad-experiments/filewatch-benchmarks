/* jshint node: true, esversion: 6 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');

const getFolderSize = promisify(require('get-folder-size'));
const mkdirp = require('mkdirp');
const root = require('rootrequire');
const pkg = require(`${root}/package.json`);

module.exports = async name => {
  const dir = path.resolve(root, 'temp', `project-$name`);
  mkdirp.sync(dir);
  fs.writeFileSync(path.resolve(dir, 'package.json'), JSON.stringify({
    name: `project-${name}`,
    dependencies: {
      [`${name}`]: pkg.dependencies[name]
    }
  }));

  execSync('npm install', { cwd: dir, stdio: 'inherit' });

  const size = await getFolderSize(path.resolve(dir, 'node_modules'));

  return size;
};
