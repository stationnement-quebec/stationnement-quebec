/** Server to use in production. Will download data at launch. */

var download = require('./lib/download.js');
var dayLengthInMilliseconds = 1000 * 60 * 60 * 24;

download.updateData();
setInterval(function(){
	download.updateData();
},dayLengthInMilliseconds);

require('./server');
