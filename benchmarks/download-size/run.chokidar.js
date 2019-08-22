const pretty = require('pretty-bytes');

require('./get-installed-size.js')('chokidar').then(size => {
  console.log(pretty(size));
});
