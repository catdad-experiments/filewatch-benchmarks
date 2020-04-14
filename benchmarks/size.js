const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');

const root = require('rootrequire');
const countFiles = promisify(require('count-files'));
const mkdirp = require('mkdirp');
const bytes = require('pretty-bytes');
const table = require('fancy-text-table');
const chalk = require('chalk');
const pkg = require(`${root}/package.json`);

const clean = require('../lib/clean.js');

const libs = ['chokidar', 'gaze', 'sane', 'watchboy'];

async function getResults(name) {
  const dir = path.resolve(root, 'temp', `project-${name}`);
  mkdirp.sync(dir);
  fs.writeFileSync(path.resolve(dir, 'package.json'), JSON.stringify({
    name: `project-${name}`,
    dependencies: {
      [`${name}`]: pkg.dependencies[name]
    }
  }));

  execSync('npm install', { cwd: dir, stdio: 'ignore' });

  let packages = 0;

  const result = await countFiles(path.resolve(dir, 'node_modules'), {
    ignore: file => {
      if (/package\.json/.test(file)) {
        packages += 1;
      }

      return false;
    }
  });

  return {
    directories: result.dirs,
    files: result.files,
    packages: packages,
    size: result.bytes
  };
}

function serializer(name, result) {
  const tbl = table();
  tbl.line();

  const title = str => tbl.title(chalk.magenta(str));
  const row = arr => tbl.row([' ', ...arr]);
  const headings = arr => row(arr.map(s => chalk.cyan.bold(s)));

  title('File count and total size');
  headings(['module', 'packages', 'directories', 'files', 'size']);

  libs.forEach(lib => {
    row([
      `${lib} (${process.platform})`,
      result.metrics[`${lib}:packages`].median,
      result.metrics[`${lib}:directories`].median,
      result.metrics[`${lib}:files`].median,
      bytes(result.metrics[`${lib}:size`].median),
    ]);
  });

  return tbl.render();
}

module.exports = {
  serializer,
  duration: '1ms',
  concurrent: 1,
  beforeAll: cb => {
    clean();
    setTimeout(() => cb(), 1);
  },
  afterAll: cb => {
    clean();
    setTimeout(() => cb(), 1);
  },
  test: function (cb) {
    const data = {};
    const that = this;

    Promise.resolve()
    .then(() => getResults('chokidar'))
    .then(result => { data['chokidar'] = result; })
    .then(() => getResults('gaze'))
    .then(result => { data['gaze'] = result; })
    .then(() => getResults('sane'))
    .then(result => { data['sane'] = result; })
    .then(() => getResults('watchboy'))
    .then(result => { data['watchboy'] = result; })
    .then(() => {
      libs.forEach(lib => {
        that.metric(`${lib}:directories`, data[lib].directories);
        that.metric(`${lib}:files`, data[lib].files);
        that.metric(`${lib}:packages`, data[lib].packages);
        that.metric(`${lib}:size`, data[lib].size);
      });

      cb();
    })
    .catch(err => cb(err));
  }
};
