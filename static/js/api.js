$.API = {
	getInformation: function(bounds, callback) {
		$.get( "http://acc-api.ville.quebec.qc.ca/stationnement/rest/vdqpark/availabilityservice?response=json", function( data ) {
			if (data.STATUS != "SUCCESS") {
				return;
			}
			$(data.AVL).each(function() {
				$.API.addObject(callback, this);
			});
		});
	},

	addObject: function(callback, avl) {
		if (avl.PTS != "1") {
			return;
		}
		var mapObject = {tag: "paying_parking"};
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
		mapObject.description = "<div>Lieu: "+description+"</div><div>Quantité Restante: "+(avl.OPER - avl.OCC)+"/"+avl.OPER+"</div>";
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
