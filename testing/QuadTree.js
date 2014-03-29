var BoundingBox = require('./BoundingBox.js');

module.exports = function QuadTree(bbox, clusteringFunction, minimalDistanceBetweenNodes, nodeCapacity) {

	if(typeof nodeCapacity === "undefined")
			nodeCapacity = 4;

	this.boundary = bbox;
	this.clusteringFunction = clusteringFunction;
	this.minDist = minimalDistanceBetweenNodes;
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
	function queryRange(bbox, maxDepth) {

		if(typeof maxDepth === "undefined")
			maxDepth = 100000;
	
		var objectsInRange = new Array();

		// check if the wanted area intersect with our bounding box	
		if(!this.boundary.intersect(bbox))
			return objectsInRange;

		for(var i = 0; i < this.data.length; i++) {

			if(bbox.containsPoint(this.data[i]["location"].x, this.data[i]["location"].y))
				objectsInRange.push(this.data[i]);
		}
		
		for(var i = 0; i < objectsInRange.length; i++) {
			
		}

		if (this.northWest != null) {
			
			Array.prototype.push.apply(objectsInRange,this.northWest.queryRange(bbox, maxDepth - 1));
			Array.prototype.push.apply(objectsInRange,this.northEast.queryRange(bbox, maxDepth - 1));
			Array.prototype.push.apply(objectsInRange,this.southWest.queryRange(bbox, maxDepth - 1));
			Array.prototype.push.apply(objectsInRange,this.southEast.queryRange(bbox, maxDepth - 1));
		}
		if (maxDepth == 0) {
			
			var meanValue = this.clusteringFunction(objectsInRange);
			objectsInRange = new Array();
			objectsInRange.push(meanValue);
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
		for (var i = 0; i < this.data.length; i++) {

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
