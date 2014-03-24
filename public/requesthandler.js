$.requestHandler = {
	refresh: {},

	request: function(dataSource, callback) {
		//TODO add cache
		if (this.refresh[dataSource.id] !== undefined) {
			clearTimeout(this.refresh[dataSource.id]);
		}
		this.getInformation(dataSource, callback);
	},

	getInformation: function(dataSource, callback) {
		if (dataSource.minZoom !== undefined && $.parkingMap.getZoom() < dataSource.minZoom) {
			return;
		}
		var bounds = $.parkingMap.getBounds();
		dataSource.source.getInformation(bounds, callback);
		if (dataSource.refreshTimer !== undefined) {
			this.refresh[dataSource.id] = setTimeout(function() {
				$.requestHandler.getInformation(dataSource, callback);
			}, dataSource.refreshTimer * 1000);
		}
	}
};
