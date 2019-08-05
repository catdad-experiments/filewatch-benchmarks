/* jshint node: true, esversion: 6 */
const path = require('path');
const root = require('rootrequire');
require('del').sync([
  path.resolve(root, 'temp/**'),
  `!${path.resolve(root, 'temp')}`
]);
