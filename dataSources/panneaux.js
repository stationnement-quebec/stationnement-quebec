var extraction = require('../infoExtraction/parkingInfoExtractor.js');
var verifier = require('../infoExtraction/parkingAllowedVerifier.js');
var geometryCalculator = require('../signGeometry/geometryCalculator.js');
var exec = require('child_process').exec;
var fs = require('fs');

function getURL() {
  return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=7&f=KML";
}

function cleanData(rawDataPath, finalDataPath, callback) {
  var command = "togeojson " + rawDataPath + " > " + finalDataPath;
  exec(command, function (error, stdout, stderr) {
    var result = JSON.parse(fs.readFileSync(finalDataPath));

    var pointsArray = result['features'];
    var i = 0;
    var newArray = [];
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

      if (i < 10)
        newArray[i] = value;
      i++;
    }

    fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
      callback();
    });
  });
}

function placeSignsOnStreets(parkingData,streetIdMap) {
  var parkings = parkingData['features'];
	
  for (var i = 0; i < parkings.length; i++) {
	 var parking = parkings[i];
	 var streetCoords = streetIdMap[parking.properties.ID_VOIE_PUB];
   if (streetCoords!=undefined ){
    var segment=geometryCalculator.findClosestSegment(parking.geometry.coordinates, streetCoords);
    parking.geometry.coordinates=geometryCalculator.projectPointOnLine(parking.geometry.coordinates, segment);
	  parking.properties.streetCoordinates=segment;
    }
  }
  return parkingData;
}

function validElementsFromCenter(pointsArray, polygon, extension) {
	var gju = require('geojson-utils');
  var validData = [];

  for (var i in pointsArray) {
    var feature = pointsArray[i];
    var point = feature['geometry'];

    if (gju.pointInPolygon(point, polygon) && (extension(feature))) {
      validData.push(feature);
    }
  }
  return validData;
}

function responseExtension(value) {
  var properties = value["properties"];
  var stationnementValue = properties["parsed_parking_value"];

  properties["parking_allowed"] = verifier.isItPossibleToParkAtThisTime(new Date(), stationnementValue, 'none');

  if (properties["parking_allowed"]){
    return value;
  }
  return undefined;
}

module.exports.getURL = getURL;
module.exports.cleanData = cleanData;
module.exports.validElementsFromCenter = validElementsFromCenter;
module.exports.placeSignsOnStreets = placeSignsOnStreets;
module.exports.responseExtension = responseExtension;