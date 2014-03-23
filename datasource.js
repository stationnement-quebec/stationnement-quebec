//This file organize data, and store a cache of it

var fs = require('fs');
var panneaux = require('./dataSources/panneaux.js');

var dataCache = exports.dataCache = {};

function sources() {
	return {'panneaux' : panneaux};
}

function parseDataForKey(key, callback) {
	var path = fullPathOfFileOfKey(key);

	if (fs.existsSync(path)) {
		dataCache[key] = JSON.parse(fs.readFileSync(path));
		console.log("Loaded " + key);
		if (callback) {
			callback();
		}
	}
	// fs.exists(path, function (exist) {
	// 	if (exist) {
	// 		dataCache[key] = JSON.parse(fs.readFileSync(path));
	// 		console.log("Loaded " + key);
	// 	}
	// });
}

function parseAllData(callback) {
	for (var key in sources()) {
		parseDataForKey(key, callback);
	}
}

function fullPathOfFileOfKey(fileName) {
	return './data/' + fileName;
}

function getDataForKey(key, callback) {
	callback(dataCache[key]);
}

module.exports.sources = sources;
module.exports.parseDataForKey = parseDataForKey;
module.exports.parseAllData = parseAllData;
module.exports.fullPathOfFileOfKey = fullPathOfFileOfKey;
module.exports.getDataForKey = getDataForKey;    