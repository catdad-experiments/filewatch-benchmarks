const path = require('path');
const slash = require('slash');
const root = require('rootrequire');
const del = require('del');

module.exports = () => {
  del.sync([slash(path.resolve(root, 'temp/**'))]);
};
