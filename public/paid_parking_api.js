$.paidParkingAPI = {
	getInformation: function(bounds, callback) {
		$.get( "/vdq", function( data ) {
			if (data.STATUS != "SUCCESS") {
				return;
			}
			
			$.quadtree.clear();
			$(data.AVL).each(function() {
				if (this.TYPE == "ON") $.quadtree.insert(getQuadTreeDataFromApiData(this));
				else $.paidParkingAPI.addObject(callback, this);
			});	
		});
	},

	addObject: function(callback, avl) {
		if (avl.PTS != "1") {
			return;
		}
		var mapObject = {tag: ["paying_parking"]};
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
			mapObject.zoom = avl.ZOOM;
		}
		else {
			mapObject.id = "p_off_"+avl.OSPID;
			description = avl.DESC;
			var occupancy = avl.OCC / avl.OPER;
			mapObject.type = getVehiculeParcType(occupancy);
		}
		mapObject.available = (avl.OPER - avl.OCC);
		mapObject.description = "<div><p>Ce point de stationnement rapporte que <b>" + (avl.OPER - avl.OCC) + "</b> stationnement(s) sont libres.</p><p>Adresse: <b style=\"cursor:pointer;\" onclick=\"$.parkingMap.getDirectionsTo({latitude: "+mapObject.position.latitude+", longitude: "+mapObject.position.longitude+"});\">" + description + "</b></p></div>";
		mapObject.label = "<div class=\""+mapObject.type+"\">"+mapObject.available+"</div>";
		callback(mapObject);
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
