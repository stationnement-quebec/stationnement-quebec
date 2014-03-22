$.googleMapAdapter = {
	map: undefined,
	searchBox: undefined,
	infoWindow: undefined,

	//Adapter Functions
	createMap: function(selector, center, zoom) {
		this.map = new google.maps.Map($(selector)[0], {
			center: this.createLatLng(center),
			zoom: zoom,
			disableDefaultUI: true
		});
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
	
	createMarker: function(position, visible, icon, description) {
		var markerOptions = {};
		markerOptions.map = this.map;
		markerOptions.position = this.createLatLng(position);
		if (icon !== undefined) {
			markerOptions.icon = icon;
		}
		var marker = new google.maps.Marker(markerOptions);
		marker.setVisible(visible);
		if (description !== undefined) {
			google.maps.event.addListener(marker, "click", function() {$.googleMapAdapter.createInfoWindow(description, marker);});
		}
		return marker;
	},
	
	createPoint: function(position, radius, color, visible, description) {
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
			google.maps.event.addListener(circle, "click", function() {$.googleMapAdapter.createInfoWindow(description, circle);});
		}
	},
	
	setMarkerVisible: function(marker, visible) {
		marker.setVisible(visible);
	},
	
	setPointVisible: function(point, visible) {
		point.setVisible(visible);
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
	
	createInfoWindow: function(description, object) {
		if (this.infoWindow !== undefined) {
			this.infoWindow.close();
		}
		this.infoWindow = new google.maps.InfoWindow();
		this.infoWindow.setContent("<div class=\"infoWindow\">"+description+"</div>");
		this.infoWindow.open(this.map, object);
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
	}
};
