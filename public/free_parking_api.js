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
			var currentStreetCoordinates = current.properties.streetCoordinates;
			if (currentStreetCoordinates==undefined){
				console.log(current);
			}
			var trafficSignStreet = {
				id: $.freeParkingAPI.generateStreetId(currentStreetCoordinates),
				tag: ["free_parking"],
				path: [],
			};
			if (this.time == 0) {
				trafficSignStreet.type = "traffic_sign_no_time";
			}
			else if (this.time < 15) {
				trafficSignStreet.type = "traffic_sign_short_time";
			}
			else {
				trafficSignStreet.type = "traffic_sign_long_time";
			}
			for (var i=0; i<currentStreetCoordinates.length; i++) {
				trafficSignStreet.path.push($.freeParkingAPI.decodeCoordinates(currentStreetCoordinates[i]));
			}

			var parkingCoordinates = current.geometry.coordinates;
			var trafficSignMarker = {
 				id: "m_"+$.freeParkingAPI.generateTrafficSignId(parkingCoordinates),
 				type: "traffic_sign",
 				tag: "free_parking",
 				position: $.freeParkingAPI.decodeCoordinates(parkingCoordinates),
 			};

 			if (current.properties.description != undefined) {
				trafficSignMarker.description = current.properties.parsed_parking_value.description;
			}

 			callback(trafficSignMarker);
			callback(trafficSignStreet);
		});
	},
	
	generateStreetId: function(streetCoordinates) {
		return "st_"+streetCoordinates[0][0]+"_"+streetCoordinates[streetCoordinates.length-1][1];
	},

	generateTrafficSignId: function(trafficSignCoordinates) {
		return "ts_"+trafficSignCoordinates[0]+"_"+trafficSignCoordinates[1];
	},
	
	decodeCoordinates: function(coordinates) {
		return {latitude: coordinates[1], longitude: coordinates[0]};
	}
}
