/** Allow transformation from KML to GeoJSON */

var exec = require('child_process').exec;

function transformKML(rawDataPath, finalDataPath, callback) {
  exec("which togeojson", function (error, stdout, stderr) {
    togeojsonPath = stdout.replace(/(\r\n|\n|\r)/gm,""); //Remove any new line in the response
    var command = togeojsonPath + " " + rawDataPath + " > " + finalDataPath;
    console.log(command);
    exec(command, function (error, stdout, stderr) {
      if (callback) {
        callback();
      }
  });
});
}

module.exports.transformKML = transformKML;
