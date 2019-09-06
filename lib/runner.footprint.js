const mem = require('./memory.js');
mem.init();
// eslint-disable-next-line no-unused-vars
const mod = require(process.env.BENCHMARK_MODULE);
const memory = mem.inspect();
require('./output.js')(Object.assign({
  module: process.env.BENCHMARK_MODULE
}, memory));
