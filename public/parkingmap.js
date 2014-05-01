$.parkingMap = {
	map: undefined,
	assets: undefined,
	objects: {},
	objectIds: [],
	objectTags: {},

	objectFunctions: {
		marker: {add: "addMarker", update: "updateMarker", remove: "removeMarker"},
		point: {add: "addPoint", update: "updatePoint"},
		line: {add: "addLine", update: "updateLine"}
	},

	createMap: function(map, assets, selector, center, zoom, onLoad) {
		this.map = map;
		this.assets = assets;
		map.createMap(selector, center, zoom);
		map.addOnLoadEvent(onLoad);
		map.addOnChangeEvent(function() {$.parkingMap.update();});
	},

	addUpdateEvent: function(update) {
		this.map.addOnChangeEvent(update);
	},

	addObject: function(object) {
		if (this.assets.hasOwnProperty(object.type)) {
			var objectAssets = this.assets[object.type];
			var visible = this.isObjectVisible(objectAssets, object);
			if (this.objectExists(object)) {
				var instance = this[this.objectFunctions[objectAssets.type].update](this.objects[object.id], visible, object);
				this.objects[object.id] = {instance: instance, assets: objectAssets, object: object};
				return;
			}
			var instance = this[this.objectFunctions[objectAssets.type].add](objectAssets, object, visible);
			if (object.id != undefined) {
				this.objects[object.id] = {instance: instance, assets: objectAssets, object: object};
				this.objectIds.push(object.id);
			}
			if (object.tag != undefined) {
				for (var i=0; i<object.tag.length; i++) {
					this.addObjectTagObject(object.tag[i], object.id);
				}
			}
		}
	},
	
	deleteObjects: function(tag) {
		var objects = this.getObjectTagInformation(tag).objects;
		for (var i=0; i<objects.length; i++) {
			var info = this.objects[objects[i]];
			this[this.objectFunctions[info.assets.type].remove](info);
		}
		this.clearObjectTagInformation(tag);
	},

	isObjectVisible: function(assets, object) {
		var visible = true;
		if (assets.minZoom != undefined) {
			visible = this.map.getZoom() >= assets.minZoom;
		}
		if (object.tag != undefined) {
			for (var i=0; i<object.tag.length; i++) {
				visible = this.getObjectTagInformation(object.tag[i]).visible && visible;
			}
		}
		if (object.zoom != undefined) {
			visible = this.map.getZoom() == object.zoom && visible;
		}
		visible=this.map.isWithinBounds(object) && visible;
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
	
	clearObjectTagInformation: function(tag) {
		this.objectTags[tag] = {
			visible: true,
			objects: []
		};
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

	addMarker: function(assets, object, visible) {
		return this.map.createMarker(object.position, visible, assets.icon, object.description, object.label, object.type);
	},

	updateMarker: function(object, visible, newObject) {
		this.map.setMarkerVisible(object.instance, visible);
		if (newObject != undefined) {
			this.map.updateMarkerLabel(object.instance, newObject.label);
		}
		return object.instance;
	},
	
	removeMarker: function(object) {
		this.map.deleteMarker(object.instance);
	},
	
	addPoint: function(assets, object, visible) {
		return this.map.createPoint(object.position, assets.size, assets.color, visible, object.description, object.type);
	},

	updatePoint: function(object, visible) {
		this.map.setPointVisible(object.instance, visible);
		return object.instance;
	},
	
	addLine: function(assets, object, visible) {
		return this.map.createLine(object.path, assets.color, visible, assets.icon, object.description, object.label);
	},
	
	updateLine: function(object, visible) {
		this.map.setLineVisible(object.instance, visible);
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
			var action = "free";
			if (!$.parkingMap.payingParkingsVisible) {
				action = "paying";
			}
			$("#toggleParkingsButton").attr('class', action);
		});
	},
	
	getDirectionsTo: function(position) {
		this.map.getDirectionsTo(position);
	},
	
	setCenter: function(center) {
		this.map.setCenter(center);
	}
}
