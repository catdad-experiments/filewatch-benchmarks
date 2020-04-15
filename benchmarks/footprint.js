const path = require('path');
const { spawnSync } = require('child_process');

const root = require('rootrequire');
const bytes = require('pretty-bytes');
const table = require('fancy-text-table');
const chalk = require('chalk');

const modules = ['chokidar', 'gaze', 'sane', 'watchboy'];

const getModule = (() => {
  let c = 0;
  return () => modules[(c++) % modules.length];
})();

const file = path.resolve(root, 'lib/runner.footprint.js');

function serializer(name, result) {
  const categories = result.categories;

  const tbl = table();
  tbl.line();

  const title = str => tbl.title(chalk.magenta(str));
  const row = arr => tbl.row([' ', ...arr]);
  const headings = arr => row(arr.map(s => chalk.cyan.bold(s)));

  headings(['.', 'mean', '95th percentile']);

  Object.keys(categories).forEach(lib => {
    const metrics = categories[lib].metrics;

    title(chalk.magenta(`${lib} ${name}, ${categories[lib].info.count} iterations`));
    row(['total heap', bytes(metrics['heap total'].mean), bytes(metrics['heap total'][95])]);
    row(['total rss', bytes(metrics['rss total'].mean), bytes(metrics['rss total'][95])]);
    row(['retained heap', bytes(metrics['heap retained'].mean), bytes(metrics['heap retained'][95])]);
    row(['retained rss', bytes(metrics['rss retained'].mean), bytes(metrics['rss retained'][95])]);
    tbl.line();
  });

  return tbl.render();
}

module.exports = {
  duration: '30s',
  serializer,
  test: function(cb) {
    try {
      const { stdout, stderr, error } = spawnSync(process.execPath, ['--expose-gc', file], {
        env: Object.assign({}, process.env, {
          BENCHMARK_FORMAT: 'json',
          BENCHMARK_MODULE: getModule()
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

      this.metric('heap total', result['memory:heapTotal']);
      this.metric('heap retained', result['memory:heapRetained']);
      this.metric('rss total', result['memory:rss']);
      this.metric('rss retained', result['memory:rssRetained']);
    } catch (e) {
      return cb({ errorCode: e.message });
    }

    cb();
  }
};
