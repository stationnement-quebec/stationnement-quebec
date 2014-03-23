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

    //result['features'] = newArray;

    fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
      callback();
    });
  });
}

function sort(pointsArray) {
  // pointsArray.forEach(function (data) {
  //   if (!streets[data.properties.NOM_TOPOG])
  //     streets[data.properties.NOM_TOPOG] = []
  //   streets[data.properties.NOM_TOPOG].push(data);
  // });

  pointsArray.sort(function(a, b){
    if (a.properties.NOM_TOPOG < b.properties.NOM_TOPOG);
      return -1;
    if (a.properties.NOM_TOPOG > b.properties.NOM_TOPOG)
      return 1;

    if (a.properties.COTE_RUE != b.properties.COTE_RUE) {
      return a.COTE_RUE == "Est" ? -1 : 1;
    }

    var coordA = a.geometry.coordinates;
    var coordB = b.geometry.coordinates;

    if (coordA[0] == coordB[0]) {
      return coordA[1] - coordB[1];
    } else if (coordA[1] == coordB[1]) {
      return coordA[0] - coordB[0];
    } else {
      return (coordA[0] - coordB[0]) + (coordA[1] - coordB[1]);
    }
  });
  return pointsArray;
}

function findLines(pointsArray) {
  var sortedPoints = sort(pointsArray);
  var lines = [];

  var lastCoord = [0, 0];
  var lastStreet = "";
  var line = false;
  for (var i = 0; i < sortedPoints.length; i++) {
    var point = sortedPoints[i];
    var coord = point.geometry.coordinates;
    if (lastStreet != point.properties.NOM_TOPOG ||
        coord[0].toFixed(2) != lastCoord[0].toFixed(2) && coord[1].toFixed(2) != lastCoord[1].toFixed(2)) {

      if (line) {
        line['end'] = lastCoord;
        lines.push(line);
      }

      lastStreet = point.properties.NOM_TOPOG;
      line = {start: coord};
    } 
    lastCoord = coord;
  } 
  if (line) {
    line['end'] = lastCoord;
    lines.push(line);
  }
  return lines; 
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
module.exports.responseExtension = responseExtension;
module.exports.findLines = findLines;
