module.exports = {
  silentCount: 1,
  preCount: 3,
  count: 1,
  teardown: async () => {
    require('../../lib/clean.js')();
  }
};
