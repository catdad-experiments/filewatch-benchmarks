module.exports = require('../lib/grandma-filetest-wrapper.js')({
  dirCount: 1,
  fileCount: 6000,
  libs: ['chokidar', 'sane', 'watchboy'],
  duration: '2m'
});
