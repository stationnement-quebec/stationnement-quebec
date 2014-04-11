$.QuadTree = {
	trees: {},
	
	init: function(tag, bounds, clusteringFunction, coordinatesExtractor, capacity) {
		this.trees[tag] = {
			isComputed: false,
			computeCallback: function() {},
			clusteringFunction: clusteringFunction,
			coordinatesExtractor: coordinatesExtractor,
			capacity: capacity,
			data: {bounds: bounds, points: []}
		};
	},
	
	insert: function(tag, value) {
		var coordinates = this.trees[tag].coordinatesExtractor(value);
		this.trees[tag].data.points.push({coordinates: coordinates, value: value});
	},
	
	compute: function(tag) {
		this.trees[tag].data = this.computeData(this.trees[tag].data, this.trees[tag].capacity, this.trees[tag].clusteringFunction);
		this.trees[tag].isComputed = true;
		this.trees[tag].computeCallback();
		this.trees[tag].computeCallback = function() {};
	},
	
	computeData: function(data, capacity, clusteringFunction) {
		var returnData = {bounds: data.bounds};
		var points = data.points;
		if (points.length > capacity) {
			returnData.subSections = [];
			var splittedBounds = this.splitBounds(data.bounds);
			var subSections = [];
			for (var i = 0; i < splittedBounds.length; i++) {
				subSections.push({bounds: splittedBounds[i], points: []});
			}
			for (var i = 0; i < points.length; i++) {
				for (var j = 0; j < subSections.length; j++) {
					if (this.pointIsWithin(points[i].coordinates, subSections[j].bounds)) {
						subSections[j].points.push(points[i]);
					}
				}
			}
			var cluster = [];
			for (var i = 0; i < subSections.length; i++) {
				returnData.subSections.push(this.computeData(subSections[i], capacity, clusteringFunction));
				cluster = cluster.concat(returnData.subSections[i].points);
			}
			returnData.points = [clusteringFunction(cluster)];
		}
		else {
			returnData.points = points;
		}
		return returnData;
	},
	
	pointIsWithin: function(point, bounds) {
		return point.latitude > bounds.min.latitude && point.latitude < bounds.max.latitude && point.longitude > bounds.min.longitude && point.longitude < bounds.max.longitude;
	},
	
	splitBounds: function(bounds) {
		var splittedBounds = [];
		var minLat = bounds.min.latitude;
		var maxLat = bounds.max.latitude;
		var midLat = (minLat + maxLat) / 2
		var minLng = bounds.min.longitude;
		var maxLng = bounds.max.longitude;
		var midLng = (minLng + maxLng) / 2
		for (var i = 0; i < 4; i++) {
			var splitted = {min: {}, max: {}};
			if (i < 2) {
				splitted.min.latitude = minLat;
				splitted.max.latitude = midLat;
			}
			else {
				splitted.min.latitude = midLat;
				splitted.max.latitude = maxLat;
			}
			if (i%2 == 0) {
				splitted.min.longitude = minLng;
				splitted.max.longitude = midLng;
			}
			else {
				splitted.min.longitude = midLng;
				splitted.max.longitude = maxLng;
			}
			splittedBounds.push(splitted);
		}
		return splittedBounds;
	},
	
	query: function(tag, depth, callback) {
		if (!this.trees[tag].isComputed) {
			this.trees[tag].computeCallback = function() {$.QuadTree.query(tag, depth, callback);}
			return;
		}
		callback(this.queryData(this.trees[tag].data, depth));
	},
	
	queryData: function(data, depth) {
		if (depth <= 0 || data.subSections == undefined) return data.points;
		var points = [];
		for (var i = 0; i < data.subSections.length; i++) {
			points = points.concat(this.queryData(data.subSections[i], depth - 1));
		}
		return points;
	},
	
	clear: function(tag) {
		this.trees[tag].data = {
			bounds: this.trees[tag].data.bounds,
			points: []
		}
	}
};