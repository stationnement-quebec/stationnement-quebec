$.settings = {
	center: {latitude: 46.804431, longitude: -71.239853},
	zoom: 12,
	adapter: $.googleMapAdapter,
	assets: {
		hydrant: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/blue.png", minZoom: 16},
		parking_terminal: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/yellow.png"},
		traffic_sign: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/red.png"},
		traffic_sign_label: {type: "labeled_marker", icon: "http://google.com/mapfiles/ms/micons/red.png"},
		traffic_sign_no_time: {type: "line", color: "red", icon: "http://google.com/mapfiles/ms/micons/red.png"},
		traffic_sign_short_time: {type: "line", color: "FF9900"},
		traffic_sign_long_time: {type: "line", color: "green"},
		available_parking: {type: "labeled_marker",
			icon: $.googleMapAdapter.createMarkerIcon("icons/circle-green.png", 30, 30)
		},
		unavailable_parking: {type: "labeled_marker",
			icon: $.googleMapAdapter.createMarkerIcon("icons/circle-red.png", 30, 30)
		},
		vehicule_park_low_occupancy : {type: "labeled_marker",
			icon: $.googleMapAdapter.createMarkerIcon("icons/pin-green.png", 38, 52)
		},
		vehicule_park_high_occupancy : {type: "labeled_marker",
			icon: $.googleMapAdapter.createMarkerIcon("icons/pin-yellow.png", 38, 52)
		},
		vehicule_park_full : {type: "labeled_marker",
			icon: $.googleMapAdapter.createMarkerIcon("icons/pin-red.png", 38, 52)
		}
	},
	dataSources: [
		{id: "api", source: $.API, refreshTimer: 300},
		{id: "client", source: $.client}
	]
};
