/* jshint node: true, esversion: 6 */
const path = require('path');
const root = require('rootrequire');
const watchboy = require('watchboy');

let files = 0;
let dirs = 0;

const cwd = path.resolve(root, 'temp');
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

  global.gc();
  const memory = process.memoryUsage();
  console.log('memory: heapTotal', memory.heapTotal);
  console.log('memory: heapUsed', memory.heapUsed);
  console.log('memory: external', memory.external);
  console.log('memory: rss', memory.rss);
});
