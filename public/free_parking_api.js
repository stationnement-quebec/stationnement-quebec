$.client = {
	getInformation: function(coordinates, callback) {
		var request = "/elements?min_lat="+coordinates.min.latitude+"&min_lng="+coordinates.min.longitude;
		request += "&max_lat="+coordinates.max.latitude+"&max_lng="+coordinates.max.longitude;
		$.getJSON(request, function(data) {
			setTimeout(function(){$.client.addTrafficSigns(callback, data.panneaux);}, 0);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert($.parseJSON(jqXHR.responseText).message);
		});
		this.addTrafficSigns(callback, [{coordinates: [{start: [-71.239853, 46.804431, 0], end:[-71.240853, 46.805431, 0]}], time: 0}]);
	},

	addTrafficSigns: function(callback, elements) {
		$(elements).each(function() {

			var trafficSign = {
				id: $.client.generateTrafficSignId(this),
				tag: "free_parking",
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
			trafficSign.path.push($.client.decodeCoordinates(this.coordinates[0].start));
			for (var i=0; i<this.coordinates.length; i++) {
				trafficSign.path.push($.client.decodeCoordinates(this.coordinates[i].end));
			}
			//if (this.properties.description != undefined) {
			//	trafficSign.description = this.properties.parsed_parking_value.description;
			//}
			callback(trafficSign);
		});
	},
	
	generateTrafficSignId: function(trafficSign) {
		return "ts_"+trafficSign.coordinates[0].start[0]+"_"+trafficSign.coordinates[0].start[1];
	},
	
	decodeCoordinates: function(coordinates) {
		return {latitude: coordinates[1], longitude: coordinates[0]};
	}
}
