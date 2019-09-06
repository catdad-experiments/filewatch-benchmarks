/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const root = require('rootrequire');
const run = require('grandma/lib/run');
const report = require('grandma/lib/report');
const through = require('through2');
const streamify = require('stream-array');

const grandma = { run, report };

const files = fs.readdirSync(path.resolve(root, 'grandma'))
.filter(f => /\.js$/.test(f))
.map(f => path.resolve(root, 'grandma', f));

process.on('unhandledRejection', (reason, promise) => {
  console.log('rejected promise');
  console.log(reason);
  console.log(promise);
});

setTimeout(() => {
  console.log('!!!! timeout happened');
}, 25000);

(async function () {
  for (let file of files) {
    console.log('running', file);

    const data = [];
    const temp = through();

    temp.on('data', chunk => data.push(chunk));
    temp.on('end', () => {});

    await promisify(grandma.run)({
      duration: 10, // TODO get from file
      concurrent: 1,
      test: {
        path: file,
        name: path.basename(file).replace(path.extname(file), '')
      },
      output: temp
    });

    console.log('!!!! finished running');

    const result = await promisify(grandma.report)({
      type: 'json',
      input: streamify(data)
    });

    console.log(result);
  }
})().then(() => {
  console.log('Finished successfully');
}).catch(e => {
  console.error('Finished with error:', e);
  process.exitCode = 1;
});
