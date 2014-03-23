var dataSource = require('./datasource.js');
dataSource.parseAllData(function() {

});

var express = require('express');
var app = express();

app.get('/*',function(req,res,next){
  res.header('Access-Control-Allow-Origin' , "*" );
  next();
});

var routes = require('./routes');
app.get('/elements', routes.elements);
app.get('/vdq', routes.vdq);
app.get('/update', routes.update);

app.use(express.static(__dirname + '/public'));

app.listen(3000);

//setInterval(function(){
 // download.updateData();
//},86400000);
