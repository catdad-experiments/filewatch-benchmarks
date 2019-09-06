/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const root = require('rootrequire');
const grandma = require('grandma');
const through = require('through2');

const files = fs.readdirSync(path.resolve(root, 'grandma'))
.filter(f => /\.js$/.test(f))
.map(f => path.resolve(root, 'grandma', f));

(async function () {
  for (let file of files) {
    const test = require(file);
    const name = path.basename(file).replace(path.extname(file), '');

    console.log(`running ${name} for ${test.duration}...`);

    const data = through();

    const [ , result ] = await Promise.all([
      promisify(grandma.run)({
        duration: test.duration,
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

    console.log(test.serializer(name, result));
  }
})().then(() => {
  console.log('Finished successfully');
}).catch(e => {
  console.error('Finished with error:', e);
  process.exitCode = 1;
});
