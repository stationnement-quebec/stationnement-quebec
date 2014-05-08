$.freeParkingAPI = {
	init: function(settings) {},

	getInformation: function(coordinates, callback) {
		coordinates=$.settings.cityBounds;
		var request = "/elements?min_lat="+coordinates.min.latitude+"&min_lng="+coordinates.min.longitude;
		request += "&max_lat="+coordinates.max.latitude+"&max_lng="+coordinates.max.longitude+"&date="+$.settings.date;
		$.getJSON(request, function(data) {
			setTimeout(function(){$.freeParkingAPI.addTrafficSigns(callback, data);}, 0);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			//alert($.parseJSON(jqXHR.responseText).message);
		});
	},

	addTrafficSigns: function(callback, elements) {
		$(elements.panneaux).each(function(i, current) {
			
			var trafficSignMarker = $.freeParkingAPI.createTrafficSignMarker(current);
 			callback(trafficSignMarker);

 			if(current.properties.hasOwnProperty('streetCoordinates')){
 				var currentStreetCoordinates = current.properties.streetCoordinates;
 				var trafficSignStreet = $.freeParkingAPI.createStreetLine(currentStreetCoordinates);
 				callback(trafficSignStreet);
 			}
		});
	},
	
	createTrafficSignMarker: function(currentSign){			
		var parkingCoordinates = currentSign.geometry.coordinates;
		var trafficSignMarker = {
 			id: "m_"+$.freeParkingAPI.generateTrafficSignId(parkingCoordinates),
 			type: "traffic_sign",
 			tag: ["free_parking"],
 			position: $.freeParkingAPI.decodeCoordinates(parkingCoordinates),
 		};

 		if (currentSign.properties.description != undefined) {
			trafficSignMarker.description = currentSign.properties.parsed_parking_value.description;
		}
		return trafficSignMarker;
	},

	createStreetLine: function(streetCoordinates){
		var trafficSignStreet = {
				id: $.freeParkingAPI.generateStreetId(streetCoordinates),
				tag: ["free_parking"],
				path: [],
		};
		if (this.time < 15) {
			trafficSignStreet.type = "traffic_sign_short_time";
		}
		else {
			trafficSignStreet.type = "traffic_sign_long_time";
		}
		for (var i=0; i<streetCoordinates.length; i++) {
			trafficSignStreet.path.push($.freeParkingAPI.decodeCoordinates(streetCoordinates[i]));
		}
		return trafficSignStreet;
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
