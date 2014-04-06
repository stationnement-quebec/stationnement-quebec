/*
	GET a list of static signs within a certain area
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

  var message = {};

 try {
    var sources = dataSource.sources();
    var validParkings = {};

    var key = 'panneaux';
    if (sources.hasOwnProperty(key)) {
      var source = sources[key];
      dataSource.getDataForKey(key, function (data) {
        var pointsArray = data['features'];
        validParkings = validElementsFromCenter(pointsArray, polygon, source.responseExtension);
        //message[key] = require('../dataSources/panneaux.js').findLines(validParkings);
      });
    }

    key = 'voie_pub';
    if (sources.hasOwnProperty(key)) {
      var source = sources[key];
      dataSource.getDataForKey(key, function (data) {
        var streetsArray = data['features'];
        message[key] = require('../dataSources/voie_pub.js').findValidStreets(streetsArray, validParkings);
      });
    }
  }
  catch (err) {
    console.log(err.message);
    res.status(500);
    message = {status: "error", message: "Une erreur s'est produite sur le serveur."};
  }

  res.json(message);
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

    if (gju.pointInPolygon(point, polygon) && (extension(feature))) {
      validData.push(feature);
    }
  }
  return validData;
}
