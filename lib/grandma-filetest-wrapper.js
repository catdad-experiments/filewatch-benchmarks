const path = require('path');
const { spawnSync } = require('child_process');
const { promisify } = require('util');

const root = require('rootrequire');
const bytes = require('pretty-bytes');
const table = require('fancy-text-table');
const chalk = require('chalk');
const pad = require('lodash.padend');

const time = n => `${n.toFixed(2)}ms`;

const setup = require('../lib/setup.js');
const clean = require('../lib/clean.js');

function serializer(name, { categories }) {
  const tbl = table();
  tbl.line();

  tbl.row(['|', '....', '|', 'Ready In', '|', 'Retained Heap', '|', 'Retained RSS', '|']);

  const libNames = Object.keys(categories).reduce((m, name, i, all) => {
    m[name] = pad(name, Math.max(...(all.map(s => s.length))));
    return m;
  }, {});


  Object.keys(categories).forEach(lib => {
    const metrics = categories[lib].metrics;

    tbl.title(chalk.magenta([
      `${libNames[lib]} - ${name}`,
      `${categories[lib].info.count} iterations`,
      `${metrics['directories'].median} directories`,
      `${metrics['files'].median} files`
    ].join(', ')));

    tbl.row([
      '|', 'mean', '|',
      time(metrics['time total'].mean), '|',
      // bytes(metrics['heap total'].mean), '|',
      // bytes(metrics['rss total'].mean), '|',
      bytes(metrics['heap retained'].mean), '|',
      bytes(metrics['rss retained'].mean), '|',
    ]);
    tbl.row([
      '|', '95%', '|',
      time(metrics['time total'][95]), '|',
      // bytes(metrics['heap total'][95]), '|',
      // bytes(metrics['rss total'][95]), '|',
      bytes(metrics['heap retained'][95]), '|',
      bytes(metrics['rss retained'][95]), '|',
    ]);
  });

  tbl.line();

  return tbl.render();
}

module.exports = ({ dirCount, fileCount, libs, duration, ...rest }) => {
  const files = libs.map(lib => path.resolve(root, `lib/runner.${lib}.js`));

  const getFile = (() => {
    let c = 0;
    return () => files[(c++) % files.length];
  })();

  return Object.assign({
    serializer,
    duration,
    test: function(cb) {
      try {
        const { stdout, stderr, error } = spawnSync(process.execPath, ['--expose-gc', getFile()], {
          env: Object.assign({}, process.env, {
            BENCHMARK_FORMAT: 'json'
          })
        });

        if (error) {
          throw error;
        }

        if (stderr.length) {
          throw new Error(stderr.toString().split('\n')[0].trim() || 'Unknown Error');
        }

        const result = JSON.parse(stdout.toString());

        this.category(result.module);

        this.metric('time total', result['time']);
        this.metric('heap total', result['memory:heapTotal']);
        this.metric('heap retained', result['memory:heapRetained']);
        this.metric('rss total', result['memory:rss']);
        this.metric('rss retained', result['memory:rssRetained']);
        this.metric('files', result['files']);
        this.metric('directories', result['directories']);
      } catch (e) {
        return cb({ errorCode: e.message });
      }

      cb();
    }
  }, rest, {
    setup: async () => {
      clean();
      setup(dirCount, fileCount);

      if (rest.setup) {
        await rest.setup();
      }

      if (rest.beforeAll) {
        await promisify(rest.beforeAll)();
      }
    },
    teardown: async () => {
      clean();

      if (rest.teardown) {
        await rest.teardown();
      }

      if (rest.afterAll) {
        await promisify(rest.afterAll)();
      }
    },
    beforeAll: null,
    afterAll: null
  });
};
