var exec = require('child_process').exec;
var fs = require('fs');

function getURL() {
  return "http://donnees.ville.quebec.qc.ca/Handler.ashx?id=18&f=KML";
}

function cleanData(rawDataPath, finalDataPath, callback) {
  exec("which togeojson", function (error, stdout, stderr) {
    stdout = stdout.replace(/(\r\n|\n|\r)/gm,"");
    var command = stdout + " " + rawDataPath + " > " + finalDataPath;
    exec(command, function (error, stdout, stderr) {
      var result = JSON.parse(fs.readFileSync(finalDataPath));
      var streetsArray = result['features'];
      fs.writeFile(finalDataPath, JSON.stringify(result), "utf8", function () {
        callback();
      });
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
