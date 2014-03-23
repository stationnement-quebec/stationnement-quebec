$.client = {
	getInformation: function(coordinates, callback) {
		var request = "/elements?min_lat="+coordinates.min.latitude+"&min_lng="+coordinates.min.longitude;
		request += "&max_lat="+coordinates.max.latitude+"&max_lng="+coordinates.max.longitude;
		$.getJSON(request, function(data) {
			setTimeout(function(){$.client.addTrafficSigns(callback, data.panneaux);}, 0);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert($.parseJSON(jqXHR.responseText).message);
		});
		this.addTrafficSigns(callback, [{coordinates: [{lat: 46.804431, lng: -71.239853}, {lat: 46.805431, lng: -71.240853}], time: 0}]);
	},

	addTrafficSigns: function(callback, elements) {
		$(elements).each(function() {

			var trafficSign = {
				id: $.client.generateTrafficSignId(this),
				tag: "free_parking",
				path: this.coordinates,
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
			
			//if (this.properties.description != undefined) {
			//	trafficSign.description = this.properties.parsed_parking_value.description;
			//}
			
			callback(trafficSign);
			
			var trafficSignMarker = {
				id: "m_"+trafficSign.id,
				type: "traffic_sign_label",
				tag: "free_parking",
				position: {
					latitude: (this.coordinates[0].lat + this.coordinates[1].lat)/2,
					longitude: (this.coordinates[0].lng + this.coordinates[1].lng)/2
				},
				label: 3
			};
			callback(trafficSignMarker);
		});
	},
	
	generateTrafficSignId: function(trafficSign) {
		return "ts_"+trafficSign.coordinates[0].lat+"_"+trafficSign.coordinates[0].lng;
	}
}
