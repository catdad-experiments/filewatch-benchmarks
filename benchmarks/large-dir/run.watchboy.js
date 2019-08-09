/* jshint node: true, esversion: 6 */
const path = require('path');
const root = require('rootrequire');
const watchboy = require('watchboy');
const mem = require('./memory.js');

let files = 0;
let dirs = 0;

const cwd = path.resolve(root, 'temp');
mem.init();

const start = Date.now();
watchboy(['**/*', '!.*'], { cwd, persistent: false })
.on('add', () => {
  files += 1;
})
.on('addDir', () => {
  dirs += 1;
})
.on('ready', () => {
  const end = Date.now();

  console.log(`found ${files} files`);
  console.log(`found ${dirs} directories`);
  console.log(`ready in ${end - start} ms`);

  mem.inspect();
});
