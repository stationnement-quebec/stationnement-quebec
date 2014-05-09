var dataCache = require('./dataCache.js');
var download = require('./download.js');
var sources = dataCache.sources();

var freeParkingCacheRefreshTime = exports.freeParkingCacheRefreshTime = 1000 * 60 * 10;
var freeParkingLocalCache = {};
var localCacheCreationTime = null;

exports.getAvailableFreeParking = function(req, res) {
	var message = {};
	var key = 'panneaux';

	var date = getDateFromRequest(req);
	if(isTheRequestedDataAlreadyInCache(date)) 
		message[key] = freeParkingLocalCache;
	else {
		try {
			var validParkings = {};
			message[key] = getParkings(date);
		}
		catch (err) {
			console.log(err.message);
			res.status(500);
			message = {status: "error", message: "An error occured on the server."};
		}
	}
	res.json(message);
};

exports.updateFreeParkingLocalCache = function() {
	try {
		localCacheCreationTime = new Date();
		freeParkingLocalCache = getParkings(localCacheCreationTime);
	}
	catch (err) {
		console.log(err.message);
	}
}

function getParkings(date) {
	var validParkings = {};
	var key = 'panneaux';
	var source = sources[key];

	dataCache.getDataForKey(key, function (data) {
		var pointsArray = data['features'];
		validParkings = source.getAvailableParkingByDate(pointsArray, date);
	});
	return validParkings;
}

function getDateFromRequest(request) {
	if(request.query.date == 'null')
		return new Date();

	return new Date(request.query.date);
}

function isTheRequestedDataAlreadyInCache(date) {
	if(localCacheCreationTime == null) 
		return false;

	var differenceInMilliseconds = date.getTime() - localCacheCreationTime.getTime();
	if((differenceInMilliseconds < 0) || (differenceInMilliseconds > freeParkingCacheRefreshTime))
		return false;

	return true;
}
