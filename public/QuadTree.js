function QuadTree(bbox, clusteringFunction, nodeCapacity) {

	if(typeof nodeCapacity === "undefined")
			nodeCapacity = 4;

	this.boundary = bbox;
	this.clusteringFunction = clusteringFunction;
	this.nodeCapacity = nodeCapacity;

	this.data = new Array();
	this.northWest = null;
	this.northEast = null;
	this.southWest = null;
	this.southEast = null;


	this.insert = insert;
	function insert(parkingObject) {

		// if the object isn't in the bounding box, it cannot be added
		if(!this.boundary.containsPoint(parkingObject["location"].x, parkingObject["location"].y))
			return false;
		
		if (this.northWest == null)	{
			this.data.push(parkingObject);

			if(this.data.length > this.nodeCapacity)
				this.subdivide();

			return true;
		}
    		
		if (this.northWest.insert(parkingObject)) {return true;}
   		if (this.northEast.insert(parkingObject)) {return true;}
    		if (this.southWest.insert(parkingObject)) {return true;}
    		if (this.southEast.insert(parkingObject)) {return true;}		
	}

 
	this.queryRange = queryRange;
	function queryRange(bbox, maxDepth, objectsInRangeOriginal) {
if (objectsInRangeOriginal === undefined) objectsInRange = [];
else {
	objectsInRange = [];
	for (var i=0; i<objectsInRangeOriginal.length; i++) {
		objectsInRange.push(objectsInRangeOriginal[i]);
	}
}
		if(typeof maxDepth === "undefined")
			maxDepth = 100000;


		// check if the wanted area intersect with our bounding box	
		if(!this.boundary.intersect(bbox))
			return objectsInRange;

		var len = this.data.length;
		for(var i = 0; i < len; i++) {

			if(bbox.containsPoint(this.data[i]["location"].x, this.data[i]["location"].y))
				objectsInRange.push(this.data[i]);
		}

		if (this.northWest != null) {
			
			objectsInRange = this.northWest.queryRange(bbox, maxDepth - 1, objectsInRange);
			objectsInRange = this.northEast.queryRange(bbox, maxDepth - 1, objectsInRange);
			objectsInRange = this.southWest.queryRange(bbox, maxDepth - 1, objectsInRange);
			objectsInRange = this.southEast.queryRange(bbox, maxDepth - 1, objectsInRange);
			
		}
		if (maxDepth == 0) {
			
			return [this.clusteringFunction(objectsInRange)];
		}

		return objectsInRange;
	}


	this.subdivide = subdivide;
  	function subdivide() {

		var subWidth = this.boundary.halfWidth / 2;
		var subHeight = this.boundary.halfHeight / 2;

		this.northWest = new QuadTree(new BoundingBox(this.boundary.x - subWidth, this.boundary.y + subHeight, subWidth, subHeight), this.clusteringFunction, this.nodeCapacity);
		this.northEast = new QuadTree(new BoundingBox(this.boundary.x + subWidth, this.boundary.y + subHeight, subWidth, subHeight), this.clusteringFunction, this.nodeCapacity);
		this.southWest = new QuadTree(new BoundingBox(this.boundary.x - subWidth, this.boundary.y - subHeight, subWidth, subHeight), this.clusteringFunction, this.nodeCapacity);
		this.southEast = new QuadTree(new BoundingBox(this.boundary.x + subWidth, this.boundary.y - subHeight, subWidth, subHeight), this.clusteringFunction, this.nodeCapacity);

		this.sendDataToChildren();
	}


	this.sendDataToChildren = sendDataToChildren;
	function sendDataToChildren() {
		
		var len = this.data.length;
		for (var i = 0; i < len; i++) {

			if(!this.northWest.insert(this.data[i]))
   				if(!this.northEast.insert(this.data[i]))
    					if(!this.southWest.insert(this.data[i]))
    						this.southEast.insert(this.data[i]);
		}

		this.data = new Array();
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
