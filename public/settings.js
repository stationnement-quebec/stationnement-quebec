$.settings = {
	center: {latitude: 46.804431, longitude: -71.239853},
	zoom: 14,
	minZoom: 10,
	maxZoom: 21,
	
	
	adapter: $.googleMapAdapter,
	assets: {
		traffic_sign: {type: "marker", icon: {url: "icons/circle-white.png", offset: {x: 15, y: 15}, size: {x: 30, y: 30}}, minZoom: 19},
		traffic_sign_label: {type: "marker", icon: {url: "http://google.com/mapfiles/ms/micons/red.png"}},
		traffic_sign_no_time: {type: "line", color: "red", icon: {url: "http://google.com/mapfiles/ms/micons/red.png"}},
		traffic_sign_short_time: {type: "line", color: "FF9900"},
		traffic_sign_long_time: {type: "line", color: "green"},
		search_result: {type: "marker", icon: {url: "icons/search_icon.png", size: {x: 32, y: 32}, offset: {x: 16, y: 16}}},
		current_location: {type: "marker", icon: {url: "icons/location_icon.png", size: {x: 20, y: 20}, offset: {x: 10, y: 10}}},
		available_parking: {type: "marker", icon: {url: "icons/circle-green.png", size: {x: 30, y: 30}, offset: {x: 15, y: 15}}},
		unavailable_parking: {type: "marker", icon: {url: "icons/circle-red.png", size: {x: 30, y: 30}, offset: {x: 15, y: 15}}},
		vehicule_park_low_occupancy : {type: "marker", icon: {url: "icons/pin-green.png", size: {x: 38, y: 52}}},
		vehicule_park_high_occupancy : {type: "marker", icon: {url: "icons/pin-yellow.png", size: {x: 38, y: 52}}},
		vehicule_park_full : {type: "marker", icon: {url: "icons/pin-red.png", size: {x: 38, y: 52}}}
	},
	dataSources: [
		{id: "paid", source: $.paidParkingAPI, refreshTimer: 60, capacity: 4, bounds: {min: {latitude: 46.75329394726448, longitude: -71.30232614453123}, max: {latitude: 46.855519489356276, longitude: -71.15737985546873}}}, 
		{id: "free", source: $.freeParkingAPI},
		{id: "quad", source: $.paidParkingClusterer, zoomModifier: 10}
	]
};
