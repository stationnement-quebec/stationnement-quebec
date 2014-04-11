$.freeParkingAPI = {
	init: function(settings) {},

	getInformation: function(coordinates, callback) {
		var request = "/elements?min_lat="+coordinates.min.latitude+"&min_lng="+coordinates.min.longitude;
		request += "&max_lat="+coordinates.max.latitude+"&max_lng="+coordinates.max.longitude;
		$.getJSON(request, function(data) {
			setTimeout(function(){$.freeParkingAPI.addTrafficSigns(callback, data);}, 0);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			//alert($.parseJSON(jqXHR.responseText).message);
		});
	},

	addTrafficSigns: function(callback, elements) {
		$(elements.panneaux).each(function(i, current) {
			currentStreetCoordinates = current.properties.streetCoordinates;
			var trafficSign = {
				id: $.freeParkingAPI.generateTrafficSignId(currentStreetCoordinates),
				tag: ["free_parking"],
				path: [],
			};
			if (this.time == 0) {
				trafficSign.type = "traffic_sign_no_time";
			}
			else if (this.time < 15) {
				trafficSign.type = "traffic_sign_short_time";
			}
			else {
				trafficSign.type = "traffic_sign_long_time";
			}
			for (var i=0; i<currentStreetCoordinates.length; i++) {
				trafficSign.path.push($.freeParkingAPI.decodeCoordinates(currentStreetCoordinates[i]));
			}
			//if (this.properties.description != undefined) {
			//	trafficSign.description = this.properties.parsed_parking_value.description;
			//}
			callback(trafficSign);
		});
	},
	
	generateTrafficSignId: function(trafficSignCoords) {
		return "ts_"+trafficSignCoords[0][0]+"_"+trafficSignCoords[trafficSignCoords.length-1][1];
	},
	
	decodeCoordinates: function(coordinates) {
		return {latitude: coordinates[1], longitude: coordinates[0]};
	}
}
