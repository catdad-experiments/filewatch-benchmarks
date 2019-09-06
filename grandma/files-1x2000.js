module.exports = require('../lib/grandma-filetest-wrapper.js')({
  dirCount: 1,
  fileCount: 2000,
  libs: ['chokidar', 'gaze', 'watchboy'],
  duration: '2m'
});
