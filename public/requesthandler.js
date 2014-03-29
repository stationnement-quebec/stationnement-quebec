$.requestHandler = {
	refresh: {},

	request: function(dataSource, callback) {
		if (dataSource.refreshTimer === undefined || this.refresh[dataSource.id] === undefined) {
			this.getInformation(dataSource, callback);
		}
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
