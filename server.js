var dataSource = require('./lib/datasource.js');
dataSource.parseAllData();

var express = require('express');
var app = express();

app.get('/*',function(req,res,next){
  res.header('Access-Control-Allow-Origin' , "*" );
  next();
});

var routes = require('./routes/index.js');
app.get('/elements', routes.elements);
app.get('/update', routes.update);

app.use(express.static(__dirname + '/public'));

app.listen(3000);
