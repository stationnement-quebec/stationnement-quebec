module.exports = function BoundingBox(x, y, halfWidth, halfHeight) {

	this.x = x;
	this.y = y;
	this.halfWidth = halfWidth;
	this.halfHeight = halfHeight;

	this.intersect = intersect;
	function intersect(bbox) {
		return ( (Math.abs(this.x - bbox.x) < (this.halfWidth + bbox.halfWidth)) &&
			 (Math.abs(this.y - bbox.y) < (this.halfHeight + bbox.halfHeight)) ); 
	}

	this.containsPoint = containsPoint;
	function containsPoint(x, y) {
		
		var xOk = ( (x >= this.x - this.halfWidth) && (x < this.x + this.halfWidth) )? true : false;
		var yOk = ( (y >= this.y - this.halfHeight) && (y < this.y + this.halfHeight) )? true : false;
		
		return (xOk && yOk);
	}	
}
