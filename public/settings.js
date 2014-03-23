$.settings = {
	center: {latitude: 46.804431, longitude: -71.239853},
	zoom: 12,
	
	adapter: $.googleMapAdapter,
	assets: {
		hydrant: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/blue.png", minZoom: 16},
		parking_terminal: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/yellow.png"},
		traffic_sign_no_time: {type: "line", color: "red"},
		traffic_sign_short_time: {type: "line", color: "FF9900"},
		traffic_sign_long_time: {type: "line", color: "green"},
		available_parking: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/green.png"},
		unavailable_parking: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/red.png"},
		vehicule_park_low_occupancy : {type: "marker", icon: "icons/parking_green.png"},
		vehicule_park_high_occupancy : {type: "marker", icon: "icons/parking_yellow.png"},
		vehicule_park_full : {type: "marker", icon: "icons/parking_red.png"}
	},
	dataSources: [
		{id: "api", source: $.API, refreshTimer: 300}, 
		{id: "client", source: $.client}
	]
};