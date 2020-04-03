const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

const root = require('rootrequire');
const fetch = require('node-fetch');
const unzip = require('unzipper');

const clean = require('../lib/clean.js');

const url = 'https://github.com/facebook/react/archive/a5df18a9e5d7cc70c30ce144dcc291e9f64cb451.zip';
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
  libs: ['chokidar', 'gaze', 'sane', 'watchboy'],
  duration: '2m',
  beforeAll: (cb) => {
    clean();
    setup().then(() => cb()).catch(e => cb(e));
  }
});
