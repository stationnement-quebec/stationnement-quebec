var http = require('http');
var dataSource = require('./datasource.js');
dataSource.parseAllData();

var gju = require('geojson-utils');
var express = require('express');
var app = express();

app.listen(3000);

app.get('/*',function(req,res,next){
  res.header('Access-Control-Allow-Origin' , "*" );
  next();
});

function validElementsFromCenter(pointsArray, polygon, extension) {
  var validData = [];

  for (var i in pointsArray) {
    var feature = pointsArray[i];
    var point = feature['geometry'];

    if (gju.pointInPolygon(point, polygon) && extension(feature)) {
      validData.push(feature);
    }
  }

  return validData;
}

app.get('/elements', function(request, response) {
  var polygon = {
    "type": "Polygon",
    "coordinates": [[[request.query.min_lng, request.query.min_lat],
    [request.query.max_lng, request.query.min_lat],
    [request.query.max_lng, request.query.max_lat],
    [request.query.min_lng, request.query.max_lat],
    [request.query.min_lng, request.query.min_lat]]]
  };

  var json = {};

  var sources = dataSource.sources();
  for (var key in sources) {
    if (sources.hasOwnProperty(key)) {
      var source = sources[key];
      dataSource.getDataForKey(key, function (data) {
        var pointsArray = data['features'];
        json[key] = validElementsFromCenter(pointsArray, polygon, source.responseExtension);
      });
    }
  }

  response.json(json);
});

app.get('/vdq', function(req, res) {
  var options = {
    host: 'acc-api.ville.quebec.qc.ca',
    port: 80,
    path: '/stationnement/rest/vdqpark/availabilityservice?response=json'
  };

  var response = "";
  http.get(options, function(resp){
    resp.on('data', function(chunk){
      response = response + chunk;
    });
    resp.on('end', function() {
      res.setHeader('Content-Type', 'application/json');
      res.send(response);
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    res.json({status:"Error"});
  });
});

app.get(/^((?!(elements|vdq))(.+)$)/, function(req, res) {
  res.sendfile('public/' + req.params[0]);
});


//var download = require('./download.js');
//download.updateData();
//setInterval(function(){
 // download.updateData();
//},86400000);
