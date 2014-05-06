/** Data source that download static parking data */

var extraction = require('../infoExtraction/parkingInfoExtractor.js');
var verifier = require('../infoExtraction/parkingAllowedVerifier.js');
var geometryCalculator = require('../signGeometry/geometryCalculator.js');
var fs = require('fs');
var kml_parser = require('../lib/kml_parser.js');

function getURL() {
  return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=7&f=KML";
}

function cleanData(rawDataPath, finalDataPath, callback) {
  kml_parser.transformKML(rawDataPath, finalDataPath, function () {
    var result = JSON.parse(fs.readFileSync(finalDataPath));

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

function validElementsFromCenter(pointsArray, request, extension) {
  var validData = [];

  if(request.date =='null'){
    request.date = new Date();
  }
  else{
    request.date = new Date(request.date);
  }

  var len = pointsArray.length;
  while (len--) {
    var feature = pointsArray[len];
    var point = feature['geometry'];
    var coordinates = point.coordinates;

    var lat = coordinates[1];
    if (lat > request.min_lat && lat < request.max_lat) {
      var lng = coordinates[0];

      if (lng > request.min_lng && lng < request.max_lng &&
          extension(feature,request.date)) {

          validData.push(feature);
      }
    }
  }

  return validData;
}

function responseExtension(value, date) {
  var properties = value["properties"];
  var stationnementValue = properties["parsed_parking_value"];

  try {
    properties["parking_allowed"] = verifier.isItPossibleToParkAtThisTime(date, stationnementValue, 'none');
  }
  catch (err) {
    console.log("Could not tell if parking is allowed : " + stationnementValue);
  }

  if (properties["parking_allowed"]){
    return true;
  }
  return undefined;
}

module.exports.getURL = getURL;
module.exports.cleanData = cleanData;
module.exports.validElementsFromCenter = validElementsFromCenter;
module.exports.placeSignsOnStreets = placeSignsOnStreets;
module.exports.responseExtension = responseExtension;
