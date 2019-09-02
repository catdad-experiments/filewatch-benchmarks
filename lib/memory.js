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

    return {
      'memory:heapTotal': finalMemory.heapTotal,
      'memory:heapTotal:human': pretty(finalMemory.heapTotal),
      'memory:rss': finalMemory.rss,
      'memory:rss:human': pretty(finalMemory.rss),
      'memory:retained': finalMemory.rss - initialMemory.rss,
      'memory:retained:human':  pretty(finalMemory.rss - initialMemory.rss)
    };
  }
};
