const path = require('path');
const root = require('rootrequire');
const NodeWatcher = require('sane').NodeWatcher;

// Note: sane does not fire add events for existing files
// and does not expose the file list publicly, so we'll
// add that. I know I usually need that data.
class SaneWithFiles extends NodeWatcher {
  constructor(dir, opts) {
    super(dir, opts);

    this.files = new Set();
  }

  register(filepath, stats) {
    const result = super.register(filepath, stats);

    const is = stats && stats.isFile() ? 'file' : '???';

    if (result && is === 'file') {
      this.files.add(filepath);
    }

    return result;
  }
}

const mem = require('./memory.js');

const cwd = path.resolve(root, 'temp');
mem.init();

const start = Date.now();

const watcher = new SaneWithFiles(cwd, {
  glob: ['**/*', '!.*']
});

watcher.on('ready', () => {
  const end = Date.now();
  const memory = mem.inspect();

  const files = Array.from(watcher.files).length;
  const directories = Object.keys(watcher.watched).length;

  watcher.close();

  require('./output.js')(Object.assign({
    module: 'sane',
    files,
    directories,
    time: end - start,
    'time:human': `${end - start} ms`
  }, memory));
});
