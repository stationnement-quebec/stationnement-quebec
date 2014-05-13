/** Data source that download "panneaux de stationnement" data */

var extraction = require('../infoExtraction/parkingInfoExtractor.js');
var verifier = require('../infoExtraction/parkingAllowedVerifier.js');
var geometryCalculator = require('../lib/geometryCalculator.js');
var fs = require('fs');

function getURL() {
	return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=7&f=JSON";
}

function cleanData(rawDataPath, finalDataPath, callback) {
	var result = JSON.parse(fs.readFileSync(rawDataPath));
	var pointsArray = result['features'];
	var i = 0;
	for (var data in pointsArray) {
		var value = pointsArray[i];
		var properties = value["properties"];
		var description = properties["TYPE_DESC"];

		try {
			properties["parsed_parking_value"] = extraction.getParkingInfo(description);
		}
		catch (err) {
			console.log("Could not parse description : " + description);
		}
		pointsArray[i] = value;
		i++
	}
	fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
		callback();
	});
}

function placeSignsOnStreets(parkingData, streetIdMap) {
	var parkings = parkingData['features'];
	for (var i = 0; i < parkings.length; i++) {
		var parking = parkings[i];
		var streetCoords = streetIdMap[parking.properties.ID_VOIE_PUB];
		if (streetCoords != undefined) {
			try {
				var segment = geometryCalculator.findClosestSegment(parking.geometry.coordinates, streetCoords);
				parking.geometry.coordinates=geometryCalculator.projectPointOnLine(parking.geometry.coordinates, segment);
				parking.properties.streetCoordinates=segment;
			}
			catch (err) {
				console.log("Could not place sign on street with parking : " + parking);
			}
		}
	}
	return parkingData;
}

function getAvailableParkingByDate(pointsArray, date) {
	var validData = [];
	var len = pointsArray.length;
	while (len--) {
		var feature = pointsArray[len];
		if (isThisParkingAllowedAtThisTime(feature,date)){
			var formattedData=formatData(feature);
			validData.push(formattedData);
		}
	}
	return validData;
}

function isThisParkingAllowedAtThisTime(value, date) {
	var properties = value["properties"];
	var parkingValue = properties["parsed_parking_value"];
	try {
		properties["parking_allowed"] = verifier.isItPossibleToParkAtThisTime(date, parkingValue, 'none');
	}
	catch (err) {
		console.log("Could not tell if parking is allowed:")
		console.log(parkingValue);
	}
	return properties["parking_allowed"];
}

function formatData(data) {
	var formattedData ={};
	formattedData.coordinates=data.geometry.coordinates;
	formattedData.description=data.properties.parsed_parking_value.description;
	formattedData.streetCoordinates=data.properties.streetCoordinates;
	return formattedData;
}

module.exports.getURL = getURL;
module.exports.cleanData = cleanData;
module.exports.placeSignsOnStreets = placeSignsOnStreets;
module.exports.getAvailableParkingByDate = getAvailableParkingByDate;
