var extraction = require('../infoExtraction/parkingInfoExtractor.js');
var verifier = require('../infoExtraction/parkingAllowedVerifier.js');
var exec = require('child_process').exec;
var fs = require('fs');

function getURL() {
  return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=7&f=KML";
}

function cleanData(rawDataPath, finalDataPath, callback) {
  //This use the togeojson command line utility. Way faster than doing it directly in node
  //Not tested on Windows, I'm pretty sure that will fail
  var command = "/usr/local/bin/togeojson " + rawDataPath + " > " + finalDataPath;
  exec(command, function (error, stdout, stderr) {
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
      i++;
    }

    fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
      callback();
    });
  });
}

function responseExtension(value) {
  var properties = value["properties"];
  var stationnementValue = properties["parsed_parking_value"];

  properties["parking_allowed"] = verifier.isItPossibleToParkAtThisTime(new Date(), stationnementValue, 'none');

  return value;
}

module.exports.getURL = getURL;
module.exports.cleanData = cleanData;
module.exports.responseExtension = responseExtension;
