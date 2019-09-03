module.exports = {
  silentCount: 0,
  warmupCount: 1,
  count: 1,
  teardown: async () => {
    require('../../lib/clean.js')();
  }
};
