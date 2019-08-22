const pretty = require('pretty-bytes');

require('./get-installed-size.js')('watchboy').then(size => {
  console.log(pretty(size));
});
