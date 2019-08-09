/* jshint node: true, esversion: 6 */
const path = require('path');
const root = require('rootrequire');
const { Gaze } = require('gaze');
const mem = require('./memory.js');

const cwd = path.resolve(root, 'temp');
mem.init();

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

  mem.inspect();

  process.exit(0);
});
