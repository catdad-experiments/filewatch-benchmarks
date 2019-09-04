const path = require('path');
const root = require('rootrequire');
const { spawnSync } = require('child_process');

const setup = require('../lib/setup.js');
const clean = require('../lib/clean.js');

const files = [
  'lib/runner.chokidar.js',
  'lib/runner.gaze.js',
  'lib/runner.watchboy.js'
].map(f => path.resolve(root, f));

const getFile = (() => {
  let c = 0;

  return () => files[(c++) % files.length];
})();

module.exports = {
  beforeAll: cb => {
    clean();
    setup(20, 16);
    cb();
  },
  test: function(cb) {
    try {
      this.start('one');
      const { stdout, stderr, error } = spawnSync(process.execPath, ['--expose-gc', getFile()], {
        env: Object.assign({}, process.env, {
          BENCHMARK_FORMAT: 'json'
        })
      });
      this.end('one');

      if (error) {
        throw error;
      }

      if (stderr.length) {
        throw new Error(stderr.toString().split('\n')[0].trim() || 'Unknown Error');
      }

      const result = JSON.parse(stdout.toString());

      this.category(result.module);
    } catch (e) {
      return cb(e);
    }

    cb();
  },
  afterAll: cb => {
    clean();
    cb();
  }
};
