module.exports = {
  silentCount: 0,
  warmupCount: 0,
  count: 1,
  teardown: async () => {
    require('../../lib/clean.js')();
  }
};
