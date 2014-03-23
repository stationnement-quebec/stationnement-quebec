/*
	GET a list of static sings within a certain area
 */
exports.elements = function(req, res) {
	var polygon = {
    "type": "Polygon",
    "coordinates": [[[req.query.min_lng, req.query.min_lat],
    [req.query.max_lng, req.query.min_lat],
    [req.query.max_lng, req.query.max_lat],
    [req.query.min_lng, req.query.max_lat],
    [req.query.min_lng, req.query.min_lat]]]
  };

  var dataSource = require('../lib/datasource.js');

  var json = {};

 try {
    var sources = dataSource.sources();
    for (var key in sources) {
      if (sources.hasOwnProperty(key)) {
        var source = sources[key];
        dataSource.getDataForKey(key, function (data) {
          var pointsArray = data['features'];
          json[key] = validElementsFromCenter(pointsArray, polygon, source.responseExtension);
          json[key] = require('../dataSources/panneaux.js').findLines(json[key]);
        });
      }
    }
  }
  catch (err) {
    console.log(err.message);
    res.status(500);
    json = {status: "error", message: "Une erreur s'est produite sur le serveur."};
  }

  res.json(json);
};

/*
	Proxy to the dynamic api
 */
exports.vdq = function(req, res) {
	var http = require('http');
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
};

exports.update = function(req, res) {
	require('../lib/download.js').updateData();
	res.json({status: "ok"});
};

//TODO: Move it in a more appropriate file
function validElementsFromCenter(pointsArray, polygon, extension) {
	var gju = require('geojson-utils');
  var validData = [];

  for (var i in pointsArray) {
    var feature = pointsArray[i];
    var point = feature['geometry'];

    if (gju.pointInPolygon(point, polygon) && (extension(feature) || true)) {
      validData.push(feature);
    }
  }

  return validData;
}