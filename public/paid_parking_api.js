$.paidParkingAPI = {
	init: function(settings) {
		$.QuadTree.init("paid", settings.bounds, this.cluster, this.extractCoordinates, settings.capacity);
	},

	getInformation: function(bounds, callback) {
		$.get("http://acc-api.ville.quebec.qc.ca/stationnement/rest/vdqpark/availabilityservice?response=json", function( data ) {
			if (data.STATUS != "SUCCESS") {
				return;
			}
	
			var currentID = 0;
			var previousID = 0;
			var uniqueParkings = [];
			$(data.AVL).each(function() {

				if(this.BFID !== undefined)
					currentID = this.BFID;
				else
					currentID = this.OSPID;

				if(currentID != previousID)
					uniqueParkings.push(this);
				else {

					var index = uniqueParkings.length - 1;
					uniqueParkings[index].OCC += this.OCC;
					uniqueParkings[index].OPER += this.OPER;					
				}
				previousID = currentID;	
			});

			$.QuadTree.clear("paid");
			uniqueParkings.forEach(function(value) {
			
				$.QuadTree.insert("paid", value);
			});
			$.QuadTree.compute("paid");
		});
	},

	addObject: function(callback, avl, zoom) {
		if (avl.PTS != "1") {
			return;
		}
		var mapObject = {tag: ["paying_parking"], zoom: zoom};
		var points = avl.LOC.split(",");
		mapObject.position = {
			latitude: points[1],
			longitude: points[0]
		};
		var description = "";
		if (avl.TYPE == "ON") {
			mapObject.id = "p_on_"+avl.BFID;
			description = avl.NAME;
			if (+avl.OCC < +avl.OPER) {
				mapObject.type = "available_parking";
			}
			else {
				mapObject.type = "unavailable_parking";
			}
		}
		else {
			mapObject.id = "p_off_"+avl.OSPID;
			description = avl.DESC;
			var occupancy = avl.OCC / avl.OPER;
			mapObject.type = getVehiculeParcType(occupancy);
		}
		mapObject.available = (avl.OPER - avl.OCC);
		if(!avl.CLUSTER) {

		mapObject.description = "<div><p>Ce point de stationnement rapporte que <b>" + (avl.OPER - avl.OCC) + "</b> stationnement(s) sont libres.</p><p>Adresse: <b>" + description + "</b></p><p><button class=\"expand\" onclick=\"$.parkingMap.getDirectionsTo({latitude: "+mapObject.position.latitude+", longitude: "+mapObject.position.longitude+"});\">Obtenir l'itinéraire</button></p></div>";

		}
		mapObject.label = "<div class=\""+mapObject.type+"\">"+mapObject.available+"</div>";
		callback(mapObject);
	},
	
	cluster: function(nodeArray) {
		var id = "c";
		if (nodeArray[0].value.TYPE == "ON") id += nodeArray[0].value.BFID;
		else id += nodeArray[0].value.OSPID;
		var clusterNode = {
			PTS: "1",
			TYPE: "ON",
			NAME: "",
			BFID: id,
			OCC: 0,
			OPER: 0,
			CLUSTER: true
		};
		var clusterLatitude = 0;
		var clusterLongitude = 0;
		for (var i = 0; i < nodeArray.length; i++) {
			clusterNode.OPER += parseFloat(nodeArray[i].value.OPER);
			clusterNode.OCC += parseFloat(nodeArray[i].value.OCC);
			clusterLatitude += parseFloat(nodeArray[i].coordinates.latitude);
			clusterLongitude += parseFloat(nodeArray[i].coordinates.longitude);
		}
		clusterLatitude /= nodeArray.length;
		clusterLongitude /= nodeArray.length;
		clusterNode.LOC = clusterLongitude+","+clusterLatitude;
		return {
			coordinates: {
				latitude: clusterLatitude,
				longitude: clusterLongitude
			},
			value: clusterNode
		};
	},
	
	extractCoordinates: function(avl) {
		var points = avl.LOC.split(",");
		return {
			latitude: parseFloat(points[1]),
			longitude: parseFloat(points[0])
		};		
	}
}


function getVehiculeParcType(occupancy) {

	var type = "vehicule_park_high_occupancy";

	if(occupancy < 0.5){
		type = "vehicule_park_low_occupancy";
	}
	else if (occupancy >= 1){
		type = "vehicule_park_full";
	}

	return type;
}
