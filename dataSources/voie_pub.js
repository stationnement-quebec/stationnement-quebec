/** Data source that download "voies publiques" data */

var fs = require('fs');
var kml_parser = require('../lib/kml_parser.js');

function getURL() {
	return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=18&f=KML";
}

function cleanData(rawDataPath, finalDataPath, callback) {
	kml_parser.transformIntoGeoJSON(rawDataPath, finalDataPath, function () {
		var result = JSON.parse(fs.readFileSync(finalDataPath));
		fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
			callback();
		});
	});
}

function getStreetsIdMap(streetsData){
	var streetsIdMap = {};
	var streets = streetsData['features'];
	for (var i = 0; i < streets.length; i++) {
		var street = streets[i];
		streetsIdMap[street.properties.ID] = street.geometry.coordinates;
	}
	return streetsIdMap;
}

module.exports.getURL = getURL;
module.exports.cleanData = cleanData;
module.exports.getStreetsIdMap = getStreetsIdMap;
