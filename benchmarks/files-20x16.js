module.exports = require('../lib/grandma-filetest-wrapper.js')({
  dirCount: 20,
  fileCount: 16,
  libs: ['chokidar', 'gaze', 'sane', 'watchboy'],
  duration: '30s'
});
