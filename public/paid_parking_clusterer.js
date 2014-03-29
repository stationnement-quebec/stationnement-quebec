$.paidParkingClusterer = {
	getInformation: function(bounds, callback) {
		var currentZoom = $.parkingMap.getZoom();
		var nodesToShow = $.quadtree.queryRange(createBoundingBoxFromMapBounds(bounds), Math.max(0, currentZoom - $.settings.zoom));
		$(nodesToShow).each(function() {
			this.data.BFID = "cluster_"+this.data.LOC;
			this.data.ZOOM = currentZoom;
			$.paidParkingAPI.addObject(callback, this.data);
		});
	}
};