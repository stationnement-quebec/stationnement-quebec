var defaultZoomlevel = 12;
var NODE_CAPACITY = 4;

function QuadTree(bbox) {

	this.boundary = bbox;
	this.data = new Array();

	this.northWest = null;
	this.northEast = null;
	this.southWest = null;
	this.southEast = null;


	this.insert = insert;
	function insert(parkingObject) {

		// if the object isn't in the bounding box, it cannot be added
		if(!this.boundary.containsPoint(parkingObject.location.longitude, parkingObject.location.latitude))
			return false;

		if(this.data.length < NODE_CAPACITY) {
			this.data.push(parkingObject);
			return true;
		}

    		if (this.northWest == null)
     			this.subdivide();

		if (this.northWest.insert(parkingObject)) {return true;}
   		if (this.northEast.insert(parkingObject)) {return true;}
    		if (this.southWest.insert(parkingObject)) {return true;}
    		if (this.southEast.insert(parkingObject)) {return true;}
	}

	this.queryRange = queryRange;
	function queryRange(bbox, maxDepth) {

		if(typeof maxDepth === "undefined")
			maxDepth = 100000;
	
		var objectsInRange = new Array();

		// check if the wanted area intersect with our bounding box	
		if(!this.boundary.intersect(bbox))
			return objectsInRange;

		for(var i = 0; i < this.data.length; i++) {
			
			if(bbox.containsPoint(this.data[i].location.longitude, this.data[i].location.latitude))
				objectsInRange.push(this.data[i]);
		}

		if(maxDepth > 0) {
			// if there's no children, it ends here
			if (this.northWest == null)
				return objectsInRange;

			// add the objects contained in the children
			Array.prototype.push.apply(objectsInRange,this.northWest.queryRange(bbox, maxDepth - 1));
			Array.prototype.push.apply(objectsInRange,this.northEast.queryRange(bbox, maxDepth - 1));
			Array.prototype.push.apply(objectsInRange,this.southWest.queryRange(bbox, maxDepth - 1));
			Array.prototype.push.apply(objectsInRange,this.southEast.queryRange(bbox, maxDepth - 1));
		}
		else {
			if (this.northWest != null) {
				// add the objects contained in the children
				Array.prototype.push.apply(objectsInRange,this.northWest.queryRange(bbox));
				Array.prototype.push.apply(objectsInRange,this.northEast.queryRange(bbox));
				Array.prototype.push.apply(objectsInRange,this.southWest.queryRange(bbox));
				Array.prototype.push.apply(objectsInRange,this.southEast.queryRange(bbox));
			}
			
			var meanValue = getMeanValueOfParkingDataArray(objectsInRange);
			objectsInRange = new Array();
			objectsInRange.push(meanValue);
		}

		return objectsInRange;
	}
	

	this.subdivide = subdivide;
  	function subdivide() {

		var subWidth = this.boundary.halfWidth / 2;
		var subHeight = this.boundary.halfHeight / 2;

		this.northWest = new QuadTree(new BoundingBox(this.boundary.x - subWidth, this.boundary.y + subHeight, subWidth, subHeight));
		this.northEast = new QuadTree(new BoundingBox(this.boundary.x + subWidth, this.boundary.y + subHeight, subWidth, subHeight));
		this.southWest = new QuadTree(new BoundingBox(this.boundary.x - subWidth, this.boundary.y - subHeight, subWidth, subHeight));
		this.southEast = new QuadTree(new BoundingBox(this.boundary.x + subWidth, this.boundary.y - subHeight, subWidth, subHeight));
	}

	this.clear = clear;
	function clear() {
		this.data = new Array();
		this.northWest = null;
		this.northEast = null;
		this.southWest = null;
		this.southEast = null;
	}
}
