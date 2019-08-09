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
    console.log('memory: heapTotal', finalMemory.heapTotal);
    console.log('memory: heapUsed', finalMemory.heapUsed);
    console.log('memory: external', finalMemory.external);
    console.log('memory: rss', finalMemory.rss);
    console.log('memory: retained', finalMemory.rss - initialMemory.rss);
  }
};
