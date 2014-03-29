$.paidParkingClusterer = {
	getInformation: function(bounds, callback) {
		var currentZoom = $.parkingMap.getZoom();
		var nodesToShow = $.quadtree.queryRange(createBoundingBoxFromMapBounds($.settings.bounds), Math.max(0, currentZoom - $.settings.zoom + $.settings.clustering));
		console.log(nodesToShow);
		$(nodesToShow).each(function() {
			this.data.BFID = "cluster_"+this.data.LOC+"_"+currentZoom;
			this.data.ZOOM = currentZoom;
			$.paidParkingAPI.addObject(callback, this.data);
		});
	}
};