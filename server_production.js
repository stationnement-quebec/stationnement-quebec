/** Server to use in production. Will download data at launch. */

var download = require('./lib/download.js');

download.updateData();
setInterval(function(){
  download.updateData();
},86400000);

require('./server');
