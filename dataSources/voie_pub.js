/** Data source that download "voies publiques" data */

var fs = require('fs');

function getURL() {
	return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=18&f=JSON";
}

function cleanData(rawDataPath, finalDataPath, callback) {
	var result = JSON.parse(fs.readFileSync(rawDataPath));
	fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
		callback();
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
