var dataSource = require('./lib/datasource.js');
var routes = require('./routes/index.js');
var express = require('express');
var app = express();

dataSource.parseAllData();

// Allow cross-domain request 
app.get('/*',function(req,res,next) {
  	res.header('Access-Control-Allow-Origin' , "*" );
  	next();
});

app.get('/elements', routes.elements);
app.get('/update', routes.update);	// may need to remove this

app.use(express.static(__dirname + '/public'));

app.listen(3000);
