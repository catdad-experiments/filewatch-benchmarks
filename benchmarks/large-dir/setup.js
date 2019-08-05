/* jshint node: true, esversion: 6 */
const fs = require('fs');
const path = require('path');
const root = require('rootrequire');

const rand = () => Math.random().toString(36).slice(2);

const dirs = [];
for (let i = 0; i < 400; i++) {
  const dir = rand();
  dirs.push(dir);
  fs.mkdirSync(path.resolve(root, 'temp', dir));

  for (let j = 0; j < 16; j++) {
    fs.writeFileSync(path.resolve(root, 'temp', dir, `${rand()}.txt`), rand());
  }
}
