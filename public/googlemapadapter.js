$.googleMapAdapter = {
	map: undefined,
	searchBox: undefined,
	searchMarker: undefined,
	searchMarkerOnCLickAction: undefined,	
	infoWindow: undefined,

	directions: false,

	//Adapter Functions
	createMap: function(selector, center, zoom, searchMarkerOnCLickAction) {
		this.map = new google.maps.Map($(selector)[0], {
			center: this.createLatLng(center),
			zoom: zoom,
			disableDefaultUI: true
		});
		this.directions = {
			renderer: new google.maps.DirectionsRenderer(),
			service: new google.maps.DirectionsService()
		};
		this.directions.renderer.setMap(this.map);
		this.fixInfoWindow();

		this.searchMarkerOnCLickAction = searchMarkerOnCLickAction;
		this.createSearchIcon();				
	},

	addOnLoadEvent: function(onLoad) {
		google.maps.event.addListenerOnce(this.map, "idle", onLoad);
	},

	addOnChangeEvent: function(onChange) {
		this.addEventListener(this.map, "idle", onChange);
	},

	getZoom: function() {
		return this.map.getZoom();
	},

	setZoom: function(zoomLevel) {
		if((zoomLevel >= $.settings.minZoom) && (zoomLevel <= $.settings.maxZoom)) {
			$.googleMapAdapter.map.setZoom(zoomLevel);
			$.googleMapAdapter.adjustBounds();
		}
	},

	addTopLeftElement: function(element) {
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(element);
	},

	addTopRightElement: function(element) {
		this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(element);
	},

	addBottomLeftElement: function(element) {
		this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(element);
	},

	addBottomRightElement: function(element) {
		this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(element);
	},

	addSearch: function(searchBox) {
		this.searchBox = new google.maps.places.SearchBox(searchBox);
		this.addEventListener(this.searchBox, 'places_changed', function() {$.googleMapAdapter.searchPlace()});
  		this.addEventListener(this.map, 'bounds_changed', function() {$.googleMapAdapter.adjustBounds()});
	},

	createMarker: function(position, visible, icon, description, label, infoWindowClass, onClickAction) {
		var markerOptions = {};
		markerOptions.map = this.map;
		markerOptions.position = this.createLatLng(position);

		if (icon !== undefined) {markerOptions.icon = this.createMarkerIcon(icon);}
		var marker = this.createLabeledOrNonLabeledMarker(label, markerOptions);
		marker.setVisible(visible);

		if (onClickAction !== undefined) {this.addEventListener(marker, "click", onClickAction);}
		else {this.addDefaultOnCLickActionToMarker(marker, description, position, infoWindowClass);}

		return marker;
	},
	
	updateMarkerLabel: function(marker, label) {
		marker.set("label", label);
	},
	
	deleteMarker: function(marker) {
		marker.setMap(null);
	},

	createPoint: function(position, radius, color, visible, description, infoWindowClass) {
		var circleOptions = {};
		circleOptions.map = this.map;
		circleOptions.center = this.createLatLng(position);
		circleOptions.fillColor = color;
		circleOptions.fillOpacity = 1;
		circleOptions.radius = radius;
		circleOptions.strokeOpacity = 0;
		var circle = new google.maps.Circle(circleOptions);
		circle.setVisible(visible);
		circle.position = circleOptions.center;
		if (description !== undefined) {
			this.addEventListener(circle, "click", function() {$.googleMapAdapter.createInfoWindow(description, circle, infoWindowClass);});
		}
		return circle;
	},

	createLine: function(path, color, visible, icon, description, label) {
		var instance = {};
		var lineOptions = {};
		lineOptions.path = [];
		for (var i=0; i<path.length; i++) {
			lineOptions.path.push(new google.maps.LatLng(path[i].latitude, path[i].longitude));
		}
		lineOptions.map = this.map;
		lineOptions.strokeColor = color;
		lineOptions.visible = visible;
		instance.line = new google.maps.Polyline(lineOptions);
		if (icon !== undefined && path.length == 2) {
			instance.marker = this.createMarker({latitude: (path[0].latitude + path[1].latitude)/2, longitude: (path[0].longitude + path[1].longitude)/2}, visible, icon, description, label);
		}
		return instance;
	},

	setMarkerVisible: function(marker, visible) {
		marker.setVisible(visible);
	},

	setPointVisible: function(point, visible) {
		point.setVisible(visible);
	},

	setLineVisible: function(line, visible) {
		line.line.setVisible(visible);
		if (line.marker)
			line.marker.setVisible(visible);
	},

	getBounds: function() {
		var bounds = this.map.getBounds();
		var sw = bounds.getSouthWest();
		var ne = bounds.getNorthEast();
		return {
			min: {
				latitude: sw.lat(),
				longitude: sw.lng()
			},
			max: {
				latitude: ne.lat(),
				longitude: ne.lng()
			}
		};
	},

	//Helper Functions
	createLatLng: function(point) {
		return new google.maps.LatLng(point.latitude, point.longitude);
	},

	createInfoWindow: function(description, object, infoWindowClass) {
		if (this.infoWindow !== undefined)
			this.infoWindow.close();

		this.infoWindow = new InfoBox({pixelOffset: new google.maps.Size(-133, -121)});
		this.infoWindow.noSupress=true; // Stop info window from being hidden by the fixInfoWindow function
		this.infoWindow.setContent("<div class=\"infoWindow\">"+description+"</div>");
		this.infoWindow.open(this.map, object);
		this.setCenter(object.getPosition());
		this.addEventListener(this.infoWindow, 'domready', function() {
			$(".infoBox").addClass(infoWindowClass);
		});
	},

	searchPlace: function() {
		var places = this.searchBox.getPlaces();
    		
		this.updateSearchMarker(places[0].name, places[0].geometry.location);
	      
		this.map.setCenter(places[0].geometry.location);
		this.map.setZoom(18);
  		this.adjustBounds();
	},

	adjustBounds: function(){
		var bounds = this.map.getBounds();
    		this.searchBox.setBounds(bounds);
	},

	isWithinBounds: function(object){
		if(object.hasOwnProperty('path')){ //For lines check if at least one end point is within bounds
			var lineIsWithinBounds = this.map.getBounds().contains(this.createLatLng(object.path[0]));
			lineIsWithinBounds = lineIsWithinBounds || this.map.getBounds().contains(this.createLatLng(object.path[1]));
			return lineIsWithinBounds;
		}
		return this.map.getBounds().contains(this.createLatLng(object.position));
	},
	
	getDirectionsTo: function(location) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var from = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var to = new google.maps.LatLng(location.latitude, location.longitude);
				$.googleMapAdapter.makeDirectionRequest(from, to);
			}, function() {
				$.googleMapAdapter.getDirectionsToNoGeolocation(location);
			});
		}
		else {
			$.googleMapAdapter.getDirectionsToNoGeolocation(location);
		}
	},

	getDirectionsToNoGeolocation: function(location) {
		var from = this.map.getCenter();
		var to = new google.maps.LatLng(location.latitude, location.longitude);
		$.googleMapAdapter.makeDirectionRequest(from, to);
	},

	makeDirectionRequest: function(from, to) {
		var request = {
			origin: from,
			destination: to,
			travelMode: google.maps.TravelMode.DRIVING
		};
		$.googleMapAdapter.directions.service.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				$.googleMapAdapter.directions.renderer.setDirections(result);
			}
		});
	},

	//Hides google maps own info windows
	fixInfoWindow: function() {
	    	var set = google.maps.InfoWindow.prototype.set;
	    	google.maps.InfoWindow.prototype.set = function (key, val) {
			if (key === 'map') {
			    if (!this.get('noSupress')) {
				console.log('This InfoWindow is supressed. To enable it, set "noSupress" option to true');
				return;
			    }
			}
			set.apply(this, arguments);
	    	}
	},
	
	setCenter: function(center) {
		this.map.setCenter(new google.maps.LatLng(center.latitude, center.longitude));
	},
	
	addEventListener: function(object, event, action) {
		google.maps.event.addListener(object, event, action);
	},

	clearEventListener: function(object, event) {
		google.maps.event.clearListeners(object, event);
	},

	createMarkerIcon: function(iconData) {
		var iconPath = iconData.url;		
		var iconOffset = null;
		if (iconData.offset) {iconOffset = new google.maps.Point(iconData.offset.x, iconData.offset.y);}
		var iconSize = null;
		if (iconData.size) {iconSize = new google.maps.Size(iconData.size.x, iconData.size.y);}

		return new google.maps.MarkerImage(iconPath, null, null, iconOffset, iconSize);
	},

	createLabeledOrNonLabeledMarker: function(label, markerOptions) {
		if (label !== undefined) {
			markerOptions.labelContent = label;
			markerOptions.labelAnchor = new google.maps.Point(4, 30);
			return new MarkerWithLabel(markerOptions);
		}

		return new google.maps.Marker(markerOptions);
	},

	addDefaultOnCLickActionToMarker: function(marker, description, position, windowClass) {
		if (description !== undefined)
			this.addEventListener(marker, "click", function() {$.googleMapAdapter.createInfoWindow(description, marker, windowClass);});
		else {
			this.addEventListener(marker, "click", function() {				
				$.googleMapAdapter.setCenter(position);
				$.googleMapAdapter.setZoom($.googleMapAdapter.getZoom() + 1);
			});
		}
	},	

	createLocationMarker: function(position) {
		var iconProperties = $.settings.assets.current_location;
		var locationMarker = this.createMarker(position, true, iconProperties.icon, "", undefined, iconProperties.type);	
	},

	createSearchIcon: function() {
		var iconProperties = $.settings.assets.search_result;
		this.searchMarker = this.createMarker(new google.maps.LatLng(46,-71), false, iconProperties.icon, "", undefined, iconProperties.type);
		this.clearEventListener(this.searchMarker, "click");		
	},

	updateSearchMarker: function(title, position) {
		this.setMarkerVisible(this.searchMarker,false);
		this.searchMarker.setTitle(title);
		this.searchMarker.setPosition(position);

		if(this.searchMarkerOnCLickAction !== undefined) {
			this.clearEventListener(this.searchMarker, "click");
			this.addEventListener(this.searchMarker, "click", searchMarkerOnCLickAction(title, position));
		}

		this.setMarkerVisible(this.searchMarker,true);
	}
};
