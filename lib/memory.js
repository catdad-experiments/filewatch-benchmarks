global.gc();
let initialMemory = process.memoryUsage();

module.exports = {
  init: () => {
    global.gc();
    initialMemory = process.memoryUsage();
  },
  inspect: () => {
    global.gc();
    const finalMemory = process.memoryUsage();

    // require these at the end, so it doesn't skew any results
    const pretty = require('pretty-bytes');
    const pad = require('lodash.padstart');

    const p = val => pad(pretty(val), 8);

    console.log('memory: heapTotal -', p(finalMemory.heapTotal), '--', finalMemory.heapTotal);
    console.log('memory: heapUsed  -', p(finalMemory.heapUsed), '--', finalMemory.heapUsed);
    console.log('memory: external  -', p(finalMemory.external), '--', finalMemory.external);
    console.log('memory: rss       -', p(finalMemory.rss), '--', finalMemory.rss);
    console.log('memory: retained  -', p(finalMemory.rss - initialMemory.rss), '--', finalMemory.rss - initialMemory.rss);
  }
};
