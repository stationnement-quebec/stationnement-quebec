/** GET a list of static signs within a certain area*/ 

var dataSource = require('./datasource.js');
var download = require('./download.js');
var sources = dataSource.sources();

exports.getValidFreeParking = function(req, res) {
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
