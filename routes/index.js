/** GET a list of static signs within a certain area*/ 

var dataSource = require('../lib/datasource.js');
var download = require('../lib/download.js');
var sources = dataSource.sources();

exports.elements = function(req, res) {
  var message = {};

 try {
    var validParkings = {};

    var key = 'panneaux';
      var source = sources[key];
      dataSource.getDataForKey(key, function (data) {
        var pointsArray = data['features'];
        validParkings = source.validElementsFromCenter(pointsArray, req.query, source.responseExtension);
      });
			message[key]=validParkings;
  }
  catch (err) {
    console.log(err.message);
    res.status(500);
    message = {status: "error", message: "An error occured on the server."};
  }

  res.json(message);
};

exports.update = function(req, res) {
	download.updateData();
	res.json({status: "ok"});
};
