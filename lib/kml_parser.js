var exec = require('child_process').exec;

function transformIntoGeoJSON(rawDataPath, finalDataPath, callback) {
	exec("which togeojson", function (error, stdout, stderr) {
		// Remove any new line in the response
		togeojsonPath = stdout.replace(/(\r\n|\n|\r)/gm,"");
		var command = togeojsonPath + " " + rawDataPath + " > " + finalDataPath;
		exec(command, function (error, stdout, stderr) {
			if (callback) {callback();} 
  		});
	});
}

module.exports.transformIntoGeoJSON = transformIntoGeoJSON;
