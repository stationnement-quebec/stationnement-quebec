$.settings = {
	adapter: $.googleMapAdapter,
	assets: {
		hydrant: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/blue.png", minZoom: 16},
		parking_terminal: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/yellow.png"},
		traffic_sign: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/red.png", minZoom: 16},
		available_parking: {type: "marker", icon: "icons/circle-green.png", minZoom: 16},
		unavailable_parking: {type: "marker", icon: "icons/circle-red.png"},
		vehicule_park_low_occupancy : {type: "marker", icon: "icons/pin-green.png"},
		vehicule_park_high_occupancy : {type: "marker", icon: "icons/pin-yellow.png"},
		vehicule_park_full : {type: "marker", icon: "icons/pin-red.png"}
	},
	dataSources: [
		{id: "api", source: $.API, refreshTimer: 300}, 
		{id: "client", source: $.client, minZoom: 16}
	]
};