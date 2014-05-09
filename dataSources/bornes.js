/** Data source that download "bornes de stationnement" data */

var fs = require('fs');
var extraction = require('../infoExtraction/parkingInfoExtractor.js');

function getURL() {
	return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=8&f=JSON";
}

function cleanData(rawDataPath, finalDataPath, callback) {
	var result = JSON.parse(fs.readFileSync(rawDataPath));
	var pointsArray = result['features'];
   
	var i = 0;
	for (var data in pointsArray) {
		var value = pointsArray[i];
		var properties = value["properties"];
		properties["parsed_parking_value"] = extraction.getParkingInfo("Stat. int. 8h - 21h");
		pointsArray[i] = value;
		i++;
	}
	fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
		callback();
	});
}

module.exports.getURL = getURL;
module.exports.cleanData = cleanData;
