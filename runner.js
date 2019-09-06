/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const root = require('rootrequire');
const grandma = require('grandma');
const through = require('through2');
const bytes = require('pretty-bytes');
const table = require('fancy-text-table');
const chalk = require('chalk');

const time = n => `${n.toFixed(2)}ms`;

const files = fs.readdirSync(path.resolve(root, 'grandma'))
.filter(f => /\.js$/.test(f))
.map(f => path.resolve(root, 'grandma', f));

function filesResultsSerializer(name, categories) {
  const tbl = table();
  tbl.line();

  const title = str => tbl.title(chalk.magenta(str));
  const row = arr => tbl.row([' ', ...arr]);
  const headings = arr => row(arr.map(s => chalk.cyan.bold(s)));

  headings(['', 'mean', '95th percentile']);

  Object.keys(categories).forEach(lib => {
    const metrics = categories[lib].metrics;

    title(chalk.magenta(`${lib} ${name}, ${categories[lib].info.count} iterations`));
    row(['ready in', time(metrics['time to ready'].mean), time(metrics['time to ready'][95])]);
    row(['total heap', bytes(metrics['heap total'].mean), bytes(metrics['heap total'][95])]);
    row(['total rss', bytes(metrics['rss total'].mean), bytes(metrics['rss total'][95])]);
    row(['retained heap', bytes(metrics['heap retained'].mean), bytes(metrics['heap retained'][95])]);
    row(['retained rss', bytes(metrics['rss retained'].mean), bytes(metrics['rss retained'][95])]);
    tbl.line();
  });

  console.log(tbl.render());
}

(async function () {
  for (let file of files) {
    const test = require(file);
    const name = path.basename(file).replace(path.extname(file), '');
    console.log(`running ${name} for ${test.duration}...`);

    const data = through();

    const [ , { categories } ] = await Promise.all([
      promisify(grandma.run)({
        duration: '30s', // TODO get from file
        concurrent: 1,
        test: {
          path: file,
          name: name
        },
        output: data
      }),
      promisify(grandma.report)({
        type: 'json',
        input: data
      })
    ]);

    filesResultsSerializer(name, categories);
  }
})().then(() => {
  console.log('Finished successfully');
}).catch(e => {
  console.error('Finished with error:', e);
  process.exitCode = 1;
});
