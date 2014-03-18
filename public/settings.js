$.settings = {
	adapter: $.googleMapAdapter,
	assets: {
		hydrant: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/blue.png", minZoom: 16},
		parking_terminal: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/yellow.png"},
		traffic_sign: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/red.png", minZoom: 16},
		available_parking: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/green.png"},
		unavailable_parking: {type: "marker", icon: "http://google.com/mapfiles/ms/micons/red.png"},
		vehicule_park_low_occupancy : {type: "marker", icon: "icons/parking_green.png"},
		vehicule_park_high_occupancy : {type: "marker", icon: "icons/parking_yellow.png"},
		vehicule_park_full : {type: "marker", icon: "icons/parking_red.png"}
	},
	dataSources: [
		{id: "api", source: $.API, refreshTimer: 300}, 
		{id: "client", source: $.client, minZoom: 16}
	]
};