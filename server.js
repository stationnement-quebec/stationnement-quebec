var freeParking = require('./lib/ValidFreeParking.js');
var dataCache = require('./lib/dataCache.js');
var express = require('express');
var app = express();
var port = process.env.port || 3000;


dataCache.parseAllData(freeParkingCacheUpdateLoop);

// Allow cross-domain request 
app.get('/*',function(req,res,next) {
  	res.header('Access-Control-Allow-Origin' , "*" );
  	next();
});

app.get('/elements', freeParking.getAvailableFreeParking);
app.use(express.static(__dirname + '/public'));
app.listen(port);


function freeParkingCacheUpdateLoop(){
	freeParking.updateFreeParkingLocalCache();
 	setInterval(function() {
		freeParking.updateFreeParkingLocalCache();
	},freeParking.freeParkingCacheRefreshTime);
}
