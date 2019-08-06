/* jshint node: true, esversion: 6 */
const path = require('path');
const root = require('rootrequire');
const { Gaze } = require('gaze');

const cwd = path.resolve(root, 'temp');
const start = Date.now();

const gaze = new Gaze(['**/*', '!.*'], { cwd });

gaze.on('ready', () => {
  const end = Date.now();
  let files = 0;
  let dirs = 0;

  (function count(obj) {
    for (let key in obj) {
      dirs += 1;

      for (let file of obj[key]) {
        if (file.slice(-1) !== path.sep) {
          files += 1;
        }
      }
    }
  }(gaze.watched()));

  console.log(`found ${files} files`);
  console.log(`found ${dirs} directories`);
  console.log(`ready in ${end - start} ms`);

  global.gc();
  const memory = process.memoryUsage();
  console.log('memory: heapTotal', memory.heapTotal);
  console.log('memory: heapUsed', memory.heapUsed);
  console.log('memory: external', memory.external);
  console.log('memory: rss', memory.rss);

  process.exit(0);
});
