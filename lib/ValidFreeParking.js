/** GET a list of static signs within a certain area*/ 

var dataCache = require('./dataCache.js');
var download = require('./download.js');
var sources = dataCache.sources();

exports.getValidFreeParking = function(req, res) {
	var message = {};
	try {
		var validParkings = {};
		var key = 'panneaux';

		var source = sources[key];
		dataCache.getDataForKey(key, function (data) {
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
