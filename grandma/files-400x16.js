module.exports = require('../lib/grandma-filetest-wrapper.js')({
  dirCount: 400,
  fileCount: 16,
  libs: ['chokidar', 'gaze', 'watchboy'],
  duration: '2m'
});
