/* eslint-disable no-console */
const table = require('fancy-text-table');
const format = process.env.BENCHMARK_FORMAT === 'json' ? 'json' : 'table';

module.exports = data => {
  if (format === 'json') {
    console.log(JSON.stringify(data));
    return;
  }

  const tbl = table();

  for (let key in data) {
    if (/:human$/.test(key)) {
      continue;
    }

    tbl.row([
      key,
      data[`${key}:human`] || data[key]
    ]);
  }

  console.log(tbl.render());
};
