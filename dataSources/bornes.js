/** Data source that download voie public data */

var fs = require('fs');
var kml_parser = require('../lib/kml_parser.js');
var extraction = require('../infoExtraction/parkingInfoExtractor.js');

function getURL() {
  return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=8&f=KML";
}

function cleanData(rawDataPath, finalDataPath, callback) {
  kml_parser.transformKML(rawDataPath, finalDataPath, function () {
    var result = JSON.parse(fs.readFileSync(finalDataPath));

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
  });
}

module.exports.getURL = getURL;
module.exports.cleanData = cleanData;
