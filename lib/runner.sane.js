const path = require('path');
const root = require('rootrequire');
const sane = require('sane');
const mem = require('./memory.js');

const cwd = path.resolve(root, 'temp');
mem.init();

const start = Date.now();

const watcher = sane(cwd, {
  glob: ['**/*', '!.*']
});

// Note: sane does not fire add events for existing files

watcher.on('ready', () => {
  const end = Date.now();
  const memory = mem.inspect();

  watcher.close();

  require('./output.js')(Object.assign({
    module: 'sane',
    files: 0,
    directories: 0,
    time: end - start,
    'time:human': `${end - start} ms`
  }, memory));
});
