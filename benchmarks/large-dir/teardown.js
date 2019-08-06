/* jshint node: true, esversion: 6 */
const path = require('path');
const slash = require('slash');
const root = require('rootrequire');
require('del').sync([slash(path.resolve(root, 'temp/**'))]);
