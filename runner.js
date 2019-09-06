/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const root = require('rootrequire');
const run = require('grandma/lib/run');
const report = require('grandma/lib/report');
const through = require('through2');

const grandma = { run, report };

const files = fs.readdirSync(path.resolve(root, 'grandma'))
.filter(f => /\.js$/.test(f))
.map(f => path.resolve(root, 'grandma', f));

(async function () {
  for (let file of files) {
    console.log('running', file);

    const data = through();

    const [ , result ] = await Promise.all([
      promisify(grandma.run)({
        duration: '30s', // TODO get from file
        concurrent: 1,
        test: {
          path: file,
          name: path.basename(file).replace(path.extname(file), '')
        },
        output: data
      }),
      promisify(grandma.report)({
        type: 'json',
        input: data
      })
    ]);

    console.log(result);
  }
})().then(() => {
  console.log('Finished successfully');
}).catch(e => {
  console.error('Finished with error:', e);
  process.exitCode = 1;
});
