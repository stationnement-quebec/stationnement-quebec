$.parkingMap = {
	assets: undefined,
	clusters: {
		paid: undefined,
		free: undefined,
	},
	map: undefined,
	objects: {},
	objectIds: [],
	objectTags: {},

	objectFunctions: {
		marker: {add: "addMarker", update: "updateMarker"},
		point: {add: "addPoint", update: "updatePoint"}
	},

	createMap: function(map, assets, selector, center, zoom, onLoad) {
		this.map = map;
		this.assets = assets;
		map.createMap(selector, center, zoom);
		map.addOnLoadEvent(onLoad);
		map.addOnChangeEvent(function() {$.parkingMap.update();});
		this.createClusters();
	},

	createClusters: function() {
		for(var cluster in this.clusters){
			this.clusters[cluster] = new MarkerClusterer(this.map.map, [], $.settings.assets['cluster_' + cluster]);
		}
	},

	addUpdateEvent: function(update) {
		this.map.addOnChangeEvent(update);
	},

	addObject: function(object) {
		if (this.assets.hasOwnProperty(object.type)) {
			var objectAssets = this.assets[object.type];
			var visible = this.isObjectVisible(objectAssets, object);
			if (this.objectExists(object)) {
				var instance = this[this.objectFunctions[objectAssets.type].update](this.objects[object.id], visible);
				this.objects[object.id] = {instance: instance, assets: objectAssets, object: object};
				return;
			}
			var instance = this[this.objectFunctions[objectAssets.type].add](objectAssets, object.type, object, visible);
			if (object.id != undefined) {
				this.objects[object.id] = {instance: instance, assets: objectAssets, object: object};
				this.objectIds.push(object.id);
			}
			if (object.tag != undefined) {
				this.addObjectTagObject(object.tag, object.id);
			}
		}
	},

	isObjectVisible: function(assets, object) {
		var visible = true;
		if (assets.minZoom != undefined) {
			visible = this.map.getZoom() >= assets.minZoom;
		}
		if (visible && object.tag != undefined) {
			visible = this.getObjectTagInformation(object.tag).visible;
		}
		return visible;
	},

	initObjectTagInformation: function(tag) {
		if (this.objectTags[tag] == undefined) {
			this.objectTags[tag] = {
				visible: true,
				objects: []
			};
		}
	},

	getObjectTagInformation: function(tag) {
		this.initObjectTagInformation(tag);
		return this.objectTags[tag];
	},

	addObjectTagObject: function(tag, id) {
		this.initObjectTagInformation(tag);
		this.objectTags[tag].objects.push(id);
	},

	setObjectTagVisible: function(tag, visible) {
		this.initObjectTagInformation(tag);
		this.objectTags[tag].visible = visible;
	},

	objectExists: function(object) {
		return (object.id != undefined && this.objects[object.id] != undefined);
	},

	addMarker: function(assets, objectType, object, visible) {
		console.log(objectType);
		var marker = this.map.createMarker(object.position, visible, assets.icon, object.description);
		if (objectType == 'traffic_sign') {
			this.clusters.free.addMarker(marker);
		} else {
			this.clusters.paid.addMarker(marker);
		}
		return marker;
	},

	updateMarker: function(object, visible) {
		this.map.setMarkerVisible(object.instance, visible);
		return object.instance;
	},

	addPoint: function(assets, object, visible) {
		return this.map.createPoint(object.position, assets.size, assets.color, visible, object.description);
	},

	updatePoint: function(object, visible) {
		this.map.setPointVisible(object.instance, visible);
		return object.instance;
	},

	update: function() {
		for (var i=0; i<this.objectIds.length; i++) {
			var objectInfo = this.objects[this.objectIds[i]];
			this[this.objectFunctions[objectInfo.assets.type].update](objectInfo, this.isObjectVisible(objectInfo.assets, objectInfo.object));
		}
	},

	addSearchBar: function() {
		var input = (document.getElementById('pac-input'));
		/*this.map.addTopLeftElement(input);*/
		this.map.addSearch(input);
	},

	addButtonBottomRight: function(button) {
		this.map.addBottomRightElement(button);
	},

	addButtonTopRight: function(button) {
		this.map.addTopRightElement(button);
	},

	setVisibility: function(tag, visible) {
		this.setObjectTagVisible(tag, visible);
		this.update();
	},

	getBounds: function() {
		return this.map.getBounds();
	},

	getZoom: function() {
		return this.map.getZoom();
	},

	addSettings: function() {
		/*var settingsButton = $("<a href=\"#settings\" id=\"open-settings\">Settings</a>");
		this.addButtonBottomRight(settingsButton[0]);*/
	},

	addToggleFreePaying: function() {
		var toggleButton = $("#toggleParkingsButton");
		/* this.addButtonTopRight(toggleButton[0]); */
		toggleButton.on("click", function() {
			$.parkingMap.payingParkingsVisible = !$.parkingMap.payingParkingsVisible;
			$.parkingMap.setVisibility("paying_parking", !$.parkingMap.payingParkingsVisible);
			$.parkingMap.setVisibility("free_packing", $.parkingMap.payingParkingsVisible);
			var action = "Not $";
			if (!$.parkingMap.payingParkingsVisible) {
				action = "$";
			}
			$("#toggleParkingsButton").html(action);
		});
	}
}
