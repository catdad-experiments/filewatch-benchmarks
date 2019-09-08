const path = require('path');
const slash = require('slash');
const root = require('rootrequire');
const del = require('del');

module.exports = () => {
  try {
    del.sync([slash(path.resolve(root, 'temp/**'))], {
      concurrency: 32 // avoid Windows EPERM errors
    });
  } catch (e) {
    if (e.code === 'EPERM') {
      module.exports ();
    }

    throw e;
  }
};
