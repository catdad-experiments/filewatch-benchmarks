const pretty = require('pretty-bytes');

require('./get-installed-size.js')('gaze').then(size => {
  console.log(pretty(size));
});
