var assert = require('assert');
var BoundingBox = require('../BoundingBox.js');

describe('BoundingBox', function() {
  	describe('#intersect()', function() {
    		it('whenTwoBoundingBoxOverlapTheyAreIntersecting', function() {

			var box1 = new BoundingBox(0,10,10,10);
			var box2 = new BoundingBox(5,15,10,10);

			var box3 = new BoundingBox(37.5,37.5,12.5,12.5);
			var box4 = new BoundingBox(0,0,30,30);

      			assert.equal(box1.intersect(box2),true);
			assert.equal(box3.intersect(box4),true);
    		})
  	})
})


describe('BoundingBox', function() {
  	describe('#intersect()', function() {
    		it('whenTwoBoundingBoxDoNotOverlapTheyAreNotIntersecting', function() {

			var box1 = new BoundingBox(0,10,10,10);
			var box2 = new BoundingBox(50,50,10,10);

      			assert.equal(box1.intersect(box2),false);
    		})
  	})
})


describe('BoundingBox', function() {
  	describe('#containsPoint()', function() {
    		it('whenAPointIsInsideTheBoundingBoxItReturnsTrue', function() {

			var box1 = new BoundingBox(0,0,10,10);
			var pointX = 0; var pointY = 0;

      			assert.equal(box1.containsPoint(pointX,pointY),true);
    		})
  	})
})

describe('BoundingBox', function() {
  	describe('#containsPoint()', function() {
    		it('whenAPointIsOutsideTheBoundingBoxItReturnsFalse', function() {

			var box1 = new BoundingBox(0,0,10,10);
			var pointX = 50; var pointY = 50;

      			assert.equal(box1.containsPoint(pointX,pointY),false);
    		})
  	})
})
