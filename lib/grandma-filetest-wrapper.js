const path = require('path');
const { spawnSync } = require('child_process');

const root = require('rootrequire');
const bytes = require('pretty-bytes');
const table = require('fancy-text-table');
const chalk = require('chalk');

const time = n => `${n.toFixed(2)}ms`;

const setup = require('../lib/setup.js');
const clean = require('../lib/clean.js');

function serializer(name, { categories }) {
  const tbl = table();
  tbl.line();

  const title = str => tbl.title(chalk.magenta(str));
  const row = arr => tbl.row([' ', ...arr]);
  const headings = arr => row(arr.map(s => chalk.cyan.bold(s)));

  headings(['', 'mean', '95th percentile']);

  Object.keys(categories).forEach(lib => {
    const metrics = categories[lib].metrics;

    title(chalk.magenta(`${lib} ${name}, ${categories[lib].info.count} iterations`));
    row(['ready in', time(metrics['time total'].mean), time(metrics['time total'][95])]);
    row(['total heap', bytes(metrics['heap total'].mean), bytes(metrics['heap total'][95])]);
    row(['total rss', bytes(metrics['rss total'].mean), bytes(metrics['rss total'][95])]);
    row(['retained heap', bytes(metrics['heap retained'].mean), bytes(metrics['heap retained'][95])]);
    row(['retained rss', bytes(metrics['rss retained'].mean), bytes(metrics['rss retained'][95])]);
    tbl.line();
  });

  return tbl.render();
}

module.exports = ({ dirCount, fileCount, libs, duration }) => {
  const files = libs.map(lib => path.resolve(root, `lib/runner.${lib}.js`));

  const getFile = (() => {
    let c = 0;
    return () => files[(c++) % files.length];
  })();

  return {
    serializer,
    duration,
    beforeAll: cb => {
      clean();
      setup(dirCount, fileCount);
      setTimeout(() => cb(), 1);
    },
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
      } catch (e) {
        return cb(e);
      }

      cb();
    },
    afterAll: cb => {
      clean();
      setTimeout(() => cb(), 1);
    }
  };
};
