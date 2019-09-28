const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

const root = require('rootrequire');
const fetch = require('node-fetch');
const unzip = require('unzipper');

const clean = require('../lib/clean.js');

const url = 'https://github.com/babel/babel/archive/a79fbe62e4bfdf0434466ff70e57ed037399b608.zip';
const dir = path.resolve(root, 'temp', 'babel');

async function setup() {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`received ${res.status} ${res.statusMessage}`);
  }

  await pipeline(res.body, unzip.Extract({
    path: dir,
  }));
}

module.exports = require('../lib/grandma-filetest-wrapper.js')({
  libs: ['chokidar', 'watchboy'],
  duration: '4m',
  beforeAll: (cb) => {
    clean();
    setup().then(() => cb()).catch(e => cb(e));
  }
});
