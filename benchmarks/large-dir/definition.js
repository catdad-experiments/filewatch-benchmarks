module.exports = {
  silentCount: 1,
  warmupCount: 3,
  count: 1,
  teardown: async () => {
    require('../../lib/clean.js')();
  }
};
