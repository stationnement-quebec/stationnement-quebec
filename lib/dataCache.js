/** Organize data, and store a cache of it */

var fs = require('fs');
var panneaux = require('../dataSources/panneaux.js');
var voie_pub = require('../dataSources/voie_pub.js');
var bornes = require('../dataSources/bornes.js');

var cache = exports.cache = {};

function sources() {
	return {'panneaux' : panneaux, 'voie_pub' : voie_pub, 'bornes' : bornes};
}

function parseDataForKey(key, callback) {
	var path = fullPathOfFileOfKey(key);

	fs.exists(path, function (exist) {
		if (exist) {
			try {
				cache[key] = JSON.parse(fs.readFileSync(path));
				console.log("Loaded " + key);
			}
			catch (err) {
				//The json we have on disk is invalid, delete the file
				//That will force the re-download of the data next update
				fs.unlinkSync(path);
				console.log("Could not load " + key);
			}

			if ('panneaux' in cache && 'bornes' in cache) {
				var panneauxFeatures = cache['panneaux']['features'];
				var bornesFeatures = cache['bornes']['features'];
				cache['panneaux']['features'] = panneauxFeatures.concat(bornesFeatures);
			}

			if ('panneaux' in cache && 'voie_pub' in cache){
				var streetIdMap = voie_pub.getStreetsIdMap(cache['voie_pub']);
				cache['panneaux'] = panneaux.placeSignsOnStreets(cache['panneaux'], streetIdMap);
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
	callback(cache[key]);
}

module.exports.sources = sources;
module.exports.parseDataForKey = parseDataForKey;
module.exports.parseAllData = parseAllData;
module.exports.fullPathOfFileOfKey = fullPathOfFileOfKey;
module.exports.getDataForKey = getDataForKey;
