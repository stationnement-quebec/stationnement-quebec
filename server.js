var freeParking = require('./lib/ValidFreeParking.js');
var dataSource = require('./lib/datasource.js');
var express = require('express');
var app = express();

dataSource.parseAllData();

// Allow cross-domain request 
app.get('/*',function(req,res,next) {
  	res.header('Access-Control-Allow-Origin' , "*" );
  	next();
});

app.get('/elements', freeParking.getValidFreeParking);

app.use(express.static(__dirname + '/public'));

app.listen(3000);
