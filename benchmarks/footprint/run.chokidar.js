const mem = require('../../lib/memory.js');
mem.init();
// eslint-disable-next-line no-unused-vars
const chokidar = require('chokidar');
const memory = mem.inspect();
require('../../lib/output.js')(memory);
