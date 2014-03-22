$.main = {
	center: {latitude: 46.804431, longitude: -71.239853},
	zoom: 12,
	
	execute: function(selector) {
		$.parkingMap.createMap($.settings.adapter, $.settings.assets, selector, this.center, this.zoom, function() {$.main.addMapInfo();});
		$.parkingMap.addUpdateEvent(function() {$.main.addMapInfo();});
		$.parkingMap.addSearchBar();
		$.parkingMap.addToggleFreePaying();
		$.parkingMap.addSettings();
	},
	
	addMapInfo: function() {
		for (var i=0; i<$.settings.dataSources.length; i++) {
			$.requestHandler.request($.settings.dataSources[i], this.addMapElement);
		}
	},
	
	addMapElement: function(element) {
		$.parkingMap.addObject(element);
	}
}