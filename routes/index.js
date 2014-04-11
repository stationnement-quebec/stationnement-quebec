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
        validParkings = source.validElementsFromCenter(pointsArray, polygon, source.responseExtension);
      });
	  message[key]=validParkings;
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
