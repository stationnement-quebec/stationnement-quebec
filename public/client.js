$.client = {
	getInformation: function(coordinates, callback) {
		var request = "http://gcampmacmini.no-ip.org:3000/elements?min_lat="+coordinates.min.latitude+"&min_lng="+coordinates.min.longitude;
		request += "&max_lat="+coordinates.max.latitude+"&max_lng="+coordinates.max.longitude;
		$.getJSON(request, function(data) {
			setTimeout(function(){$.client.addTrafficSigns(callback, data.panneaux);}, 0);
		});
	},
	
	addTrafficSigns: function(callback, elements) {
		$(elements).each(function() {
			var trafficSign = {
				id: "ts_"+this.properties.name,
				type: "traffic_sign",
				position: {
					latitude: this.geometry.coordinates[1],
					longitude: this.geometry.coordinates[0]
				}
			};
			if (this.properties.description != undefined) {
				trafficSign.description = this.properties.parsed_parking_value.description;
			}
			callback(trafficSign);
		});
	}
}