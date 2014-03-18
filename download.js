//This file makes the actual download, calling the methods from each data source

var http = require('http');
var fs = require('fs');
var mkdirp = require('mkdirp');
var jsdom = require('jsdom');
var toGeoJSON = require('togeojson');
var dataSource = require('./datasource.js');
var sys = require('sys')


module.exports = {
	updateData: function updateData() {
		var localDataSource = dataSource;

		mkdirp(localDataSource.fullPathOfFileOfKey(""), function (err) {
		  if (err) { throw err; }

		  var sources = dataSource.sources();
		  for (var key in sources) {
			  if (sources.hasOwnProperty(key)) {
				  console.log("Downloading " + key);

					var source = sources[key];
				  downloadFile(key, source, function (finishedKey) {
					  console.log("Downloaded " + finishedKey);

					  localDataSource.parseDataForKey(finishedKey);
				  });
			  }
		  }
		});
	}
}

function downloadFile(key, source, callback) {
	var finalPath = dataSource.fullPathOfFileOfKey(key);
	var tempPath = finalPath + "-temp";
	var file = fs.createWriteStream(tempPath);

	http.get(source.getURL(), function(response) {
		response.pipe(file);

		file.on('finish', function(path) {
			file.close();

			source.cleanData(tempPath, finalPath, function() {
				callback(key);

				fs.unlink(tempPath);
			});
		});
	});
}
