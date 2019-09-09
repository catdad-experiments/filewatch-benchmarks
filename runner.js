/* eslint-disable no-console */
const os = require('os');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const root = require('rootrequire');
const grandma = require('grandma');
const through = require('through2');
const prettyMs = require('pretty-ms');

const files = fs.readdirSync(path.resolve(root, 'benchmarks'))
.filter(f => /\.js$/.test(f))
.map(f => path.resolve(root, 'benchmarks', f));

const filter = process.argv.slice(2);
const benchmarkStart = Date.now();

(async function () {
  // print test machine info
  console.log(`${process.platform}, ${os.cpus()[0].model.trim()}, ${os.cpus()[0].speed}, ${os.cpus().length} cores`);

  for (let file of files) {
    const name = path.basename(file).replace(path.extname(file), '');

    if (filter.length && !filter.includes(name)) {
      console.log(`skipping ${name}`);
      continue;
    }

    const test = require(file);

    if (test.setup) {
      console.log(`running ${name} setup...`);
      const start = Date.now();
      await test.setup();
      console.log(`setup for ${name} finished in ${prettyMs(Date.now() - start)}`);
    }

    console.log(`running ${name} for ${test.duration}...`);

    const start = Date.now();
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

    console.log(JSON.stringify(result, null, 2));

    console.log(test.serializer(name, result));
    console.log(`test ${name} finished in ${prettyMs(Date.now() - start)}`);

    if (test.teardown) {
      console.log(`running ${name} teardown...`);
      const start = Date.now();
      await test.setup();
      console.log(`teardown for ${name} finished in ${prettyMs(Date.now() - start)}`);
    }
  }
})().then(() => {
  console.log('Finished successfully in', prettyMs(Date.now() - benchmarkStart));
}).catch(e => {
  console.error(`Finished in ${prettyMs(Date.now() - benchmarkStart)} with error:`, e);
  process.exitCode = 1;
});
