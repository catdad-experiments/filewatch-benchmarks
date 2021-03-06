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
  const memory = mem.inspect();

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

  require('./output.js')(Object.assign({
    module: 'gaze',
    files: files,
    directories: dirs,
    time: end - start,
    'time:human': `${end - start} ms`
  }, memory));

  process.exit(0);
});
