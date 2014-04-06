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

  var message = {};

 try {
    var sources = dataSource.sources();
    for (var key in sources) {
      if (sources.hasOwnProperty(key)) {
        var source = sources[key];
        dataSource.getDataForKey(key, function (data) {
          var pointsArray = data['features'];
          message[key] = validElementsFromCenter(pointsArray, polygon, source.responseExtension);
          message[key] = require('../dataSources/panneaux.js').findLines(message[key]);
        });
      }
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

    if (gju.pointInPolygon(point, polygon) && (extension(feature) || true)) {
      validData.push(feature);
    }
  }

  return validData;
}

function completeApiResponse(response){
	var startTime = 7;
	var endTime = 20;

	currentDate = new Date();
	currentHours = currentDate.getHours();

	if (currentHours>=endTime || currentHours <startTime){
		//replace with code to add static data to dynamic data at night
		console.log("API offline");
    }
	return response;
}
