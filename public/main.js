$.main = {		
	execute: function(selector) {
		for (var i=0; i<$.settings.dataSources.length; i++) {
			$.settings.dataSources[i].source.init($.settings.dataSources[i]);
		}
		
		$.parkingMap.createMap($.settings.adapter, $.settings.assets, selector, $.settings.center, $.settings.zoom, function() {
			setTimeout($.main.centerMapWithGeolocation, 0);
			$.main.addMapInfo();
		});
		$.parkingMap.addUpdateEvent(function() {$.main.addMapInfo();});
		$.parkingMap.addSearchBar();
		$.parkingMap.addToggleFreePaying();
		$.parkingMap.addSettings();
	},
	
	centerMapWithGeolocation: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				$.parkingMap.setCenter(position.coords);
			}, function() {});
		}
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
