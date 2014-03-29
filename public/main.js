$.main = {	
	execute: function(selector) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				$.main.executeWithCenter(selector, position.coords);
			}, function() {
				$.main.executeWithCenter(selector, $.settings.center);
			});
		}
		else {
			$.main.executeWithCenter(selector, $.settings.center);
		}
	},
	
	executeWithCenter: function(selector, center) {
			
		$.parkingMap.createMap($.settings.adapter, $.settings.assets, selector, center, $.settings.zoom, function() {
			$.quadtree = new QuadTree($.parkingMap.getBounds(), getMeanValueOfParkingDataArray, 4);
			$.main.addMapInfo();
		});
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
