var exec = require('child_process').exec;
var fs = require('fs');

function getURL() {
  return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=18&f=KML";
}

function cleanData(rawDataPath, finalDataPath, callback) {
  //This use the togeojson command line utility. Way faster than doing it directly in node
  //Not tested on Windows, I'm pretty sure that will fail
  var command = "togeojson " + rawDataPath + " > " + finalDataPath;
  exec(command, function (error, stdout, stderr) {
    var result = JSON.parse(fs.readFileSync(finalDataPath));
    var streetsArray = result['features'];
    fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
      callback();
    });
  });
}

function findValidStreets(streetsArray, validParkings) {
  var validStreets = [];
  for (var i = 0; i < streetsArray.length; i++) {
    var street = streetsArray[i];

    for (var j = 0; j < validParkings.length; j++){
      var parking = validParkings[j];
      if (street.properties.ID==parking.properties.ID_VOIE_PUB){
        validStreets.push(street.geometry.coordinates);
        break;
      }
    }
  }
  return validStreets;
}

module.exports.getURL = getURL;
module.exports.cleanData = cleanData;
module.exports.findValidStreets = findValidStreets;
