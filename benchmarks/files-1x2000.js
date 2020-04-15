module.exports = require('../lib/grandma-filetest-wrapper.js')({
  dirCount: 1,
  fileCount: 2000,
  libs: ['chokidar', 'gaze', 'sane', 'watchboy'],
  duration: '3m'
});
