$.paidParkingClusterer = {
	zoomModifier: 10,

	init: function(settings) {
		if (settings.zoomModifier) this.zoomModifier = settings.zoomModifier;
	},

	getInformation: function(bounds, callback) {
		var currentZoom = $.parkingMap.getZoom();
		$.QuadTree.query("paid", currentZoom - this.zoomModifier, function(nodesToShow) {
			$(nodesToShow).each(function() {
				$.paidParkingAPI.addObject(callback, this.value, currentZoom);
			});
		});
	}
};
