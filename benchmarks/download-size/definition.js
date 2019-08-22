module.exports = {
  silentCount: 0,
  preCount: 0,
  count: 1,
  teardown: async () => {
    require('../../lib/clean.js')();
  }
};
