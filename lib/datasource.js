//This file organize data, and store a cache of it

var fs = require('fs');
var panneaux = require('../dataSources/panneaux.js');
var voie_pub = require('../dataSources/voie_pub.js');

var dataCache = exports.dataCache = {};

function sources() {
	return {'panneaux' : panneaux, 'voie_pub' : voie_pub};
}

function parseDataForKey(key, callback) {
	var path = fullPathOfFileOfKey(key);

	fs.exists(path, function (exist) {
		if (exist) {
			dataCache[key] = JSON.parse(fs.readFileSync(path));
			console.log("Loaded " + key);
			
			if ('panneaux' in dataCache && 'voie_pub' in dataCache){
				var streetIdMap = {};
				streetIdMap=voie_pub.getStreetsIdMap(dataCache['voie_pub']);
				dataCache['panneaux']=panneaux.placeSignsOnStreets(dataCache['panneaux'], streetIdMap);
			}
		}
	});
}

function parseAllData() {
	for (var key in sources()) {
		parseDataForKey(key);
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