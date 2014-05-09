/** Organize data, and store a cache of it */

var fs = require('fs');
var panneaux = require('../dataSources/panneaux.js');
var voie_pub = require('../dataSources/voie_pub.js');
var bornes = require('../dataSources/bornes.js');

var dataCache = exports.dataCache = {};

function sources() {
	return {'panneaux' : panneaux, 'voie_pub' : voie_pub, 'bornes' : bornes};
}

function parseDataForKey(key, callback) {
	var path = fullPathOfFileOfKey(key);

	fs.exists(path, function (exist) {
		if (exist) {
			try {
				dataCache[key] = JSON.parse(fs.readFileSync(path));
				console.log("Loaded " + key);
			}
			catch (err) {
				//The json we have on disk is invalid, delete the file
				//That will force the re-download of the data next update
				fs.unlinkSync(path);
				console.log("Could not load " + key);
			}

			if ('panneaux' in dataCache && 'bornes' in dataCache) {
				var panneauxFeatures = dataCache['panneaux']['features'];
				var bornesFeatures = dataCache['bornes']['features'];
				dataCache['panneaux']['features'] = panneauxFeatures.concat(bornesFeatures);
			}

			if ('panneaux' in dataCache && 'voie_pub' in dataCache){
				var streetIdMap = voie_pub.getStreetsIdMap(dataCache['voie_pub']);
				dataCache['panneaux'] = panneaux.placeSignsOnStreets(dataCache['panneaux'], streetIdMap);
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
