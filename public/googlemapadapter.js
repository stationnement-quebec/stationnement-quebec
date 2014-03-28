$.googleMapAdapter = {
	map: undefined,
	searchBox: undefined,
	infoWindow: undefined,

	directions: false,

	//Adapter Functions
	createMap: function(selector, center, zoom) {
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
	},

	addOnLoadEvent: function(onLoad) {
		google.maps.event.addListenerOnce(this.map, "idle", onLoad);
	},

	addOnChangeEvent: function(onChange) {
		google.maps.event.addListener(this.map, "idle", onChange);
	},

	getZoom: function() {
		return this.map.getZoom();
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
		google.maps.event.addListener(this.searchBox, 'places_changed', function() {$.googleMapAdapter.searchPlace()});
  		google.maps.event.addListener(this.map, 'bounds_changed', function() {$.googleMapAdapter.adjustBounds()});
	},

	createMarker: function(position, visible, icon, description, label, infoWindowClass) {
		var markerOptions = {};
		markerOptions.map = this.map;
		markerOptions.position = this.createLatLng(position);

		if (icon !== undefined) {
			markerOptions.icon = icon;
		}
		if (label !== undefined) {
			markerOptions.labelContent = label;
			markerOptions.labelAnchor = new google.maps.Point(4, 30);
			var marker = new MarkerWithLabel(markerOptions);
		}
		else {
			var marker = new google.maps.Marker(markerOptions);
		}
		marker.setVisible(visible);
		if (description !== undefined) {
			google.maps.event.addListener(marker, "click", function() {$.googleMapAdapter.createInfoWindow(description, marker, infoWindowClass);});
		}

		return marker;
	},

	createMarkerIcon: function(iconPath, sizeX, sizeY) {
		return new google.maps.MarkerImage( iconPath, null, null, null, new google.maps.Size(sizeX, sizeY));
	},

	createLabeledMarker: function(position, visible, icon, description, label, infoWindowClass) {
		var markerOptions = {};
		markerOptions.map = this.map;
		markerOptions.position = this.createLatLng(position);

		markerOptions.labelContent = label;
		markerOptions.labelAnchor = new google.maps.Point(4, 30);
		if (icon !== undefined) {
			markerOptions.icon = icon;
		}
		var marker = new MarkerWithLabel(markerOptions);
		marker.setVisible(visible);
		if (description !== undefined) {
			google.maps.event.addListener(marker, "click", function() {$.googleMapAdapter.createInfoWindow(description, marker, infoWindowClass);});
		}

		return marker;
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
			google.maps.event.addListener(circle, "click", function() {$.googleMapAdapter.createInfoWindow(description, circle, infoWindowClass);});
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

	setLabeledMarkerVisible: function(marker, visible) {
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
		if (this.infoWindow !== undefined) {
			this.infoWindow.close();
		}
		this.infoWindow = new InfoBox({pixelOffset: new google.maps.Size(-133, -121)});
		this.infoWindow.setContent("<div class=\"infoWindow\">"+description+"</div>");
		this.infoWindow.open(this.map, object);
		google.maps.event.addListener(this.infoWindow, 'domready', function() {
			$(".infoBox").addClass(infoWindowClass);
		});
	},

	searchPlace: function() {
		var places = this.searchBox.getPlaces();
    	var bounds = new google.maps.LatLngBounds();
    	for (var i = 0, place; place = places[i]; i++) {
    		var image = {
    			url: place.icon,
    			size: new google.maps.Size(71, 71),
    			origin: new google.maps.Point(0, 0),
    			anchor: new google.maps.Point(17, 34),
    			scaledSize: new google.maps.Size(25, 25)
    		};
      		var marker = new google.maps.Marker({
      			map: this.map,
      			icon: image,
      			title: place.name,
      			position: place.geometry.location
      		});

      		bounds.extend(place.geometry.location);
  		}
		if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
			var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.001, bounds.getNorthEast().lng() + 0.001);
			var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.001, bounds.getNorthEast().lng() - 0.001);
			bounds.extend(extendPoint1);
			bounds.extend(extendPoint2);
		}
  		this.map.fitBounds(bounds);
	},

	adjustBounds: function(){
		var bounds = this.map.getBounds();
    	this.searchBox.setBounds(bounds);
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
			this.getDirectionsToNoGeolocation(location);
		}
	},

	getDirectionsToNoGeolocation: function(location) {
		var from = this.map.getCenter();
		var to = new google.maps.LatLng(location.latitude, location.longitude);
		this.makeDirectionRequest(from, to);
	},

	makeDirectionRequest: function(from, to) {
		var request = {
			origin: from,
			destination: to,
			travelMode: google.maps.TravelMode.DRIVING
		};
		this.directions.service.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				$.googleMapAdapter.directions.renderer.setDirections(result);
			}
		});
	}
};
