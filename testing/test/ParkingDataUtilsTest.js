var assert = require('assert');
var parkingDataUtils = require('../ParkingDataUtils.js');

var ApiMapBounds = { min: { latitude: -50, longitude: -50 }, max: { latitude: 50, longitude: 50 } };
var bbox_x = 0;	
var bbox_y = 0; 
var bbox_halfWidth = 50; 
var bbox_halfHeight = 50; 

var parkingData1 = {
	"data": {
		"TYPE":"ON",
		"NAME":"511 - 571 Rue Saint-Jean",
		"BFID":"105201",
		"OCC":3,
		"OPER":10,
		"PTS":"1",
		"LOC":"-72,46"
	},
	"location": { x: -72, y: 46 }
};

var parkingData2 = {
	"data": {
		"TYPE":"OFF",
		"NAME":"Complexe Marie-Guyart",
		"DESC":"1050 Rue Louis-Alexandre-Taschereau",
		"INTER":"4 bourgeois",
		"TEL":"",
		"OSPID":"101018",
		"OCC":1361,
		"OPER":1468,
		"PTS":"1",
		"LOC":"-71,47"
	},
	"location": { x: -71, y: 47 }
};

var parkingData3 = {
	"data": {
		"TYPE":"ON",
		"NAME":"511 - 571 Rue Saint-Jean",
		"BFID":"105201",
		"OCC":3,
		"OPER":10,
		"PTS":"1",
		"LOC":"-70,48"
	},
	"location": { x: -70, y: 48 }
};

var avlDataArray = new Array();
avlDataArray.push(parkingData1);
avlDataArray.push(parkingData2);
avlDataArray.push(parkingData3);

var avlDataArayOccupation = 1367;
var avlDataArayCapacity = 1488;
var avlDataArayLocation = { x: -71, y: 47 };


// createBoundingBoxFromMapBoundsValidationTest
describe('ParkingDataUtils', function() {
  	describe('#createBoundingBoxFromMapBounds()', function() {
    		it('createBoundingBoxFromMapBoundsValidationTest', function() {

			var boundingBox = parkingDataUtils.createBoundingBoxFromMapBounds(ApiMapBounds);

			assert.equal(boundingBox.x, bbox_x);
			assert.equal(boundingBox.y, bbox_y);
			assert.equal(boundingBox.halfWidth, bbox_halfWidth);
			assert.equal(boundingBox.halfHeight, bbox_halfHeight);
    		})
  	})
})


// getQuadTreeDataFromApiDataValidationTest
describe('ParkingDataUtils', function() {
  	describe('#getQuadTreeDataFromApiData()', function() {
    		it('getQuadTreeDataFromApiDataValidationTest', function() {

			assert.deepEqual(parkingDataUtils.getQuadTreeDataFromApiData(parkingData1["data"]), parkingData1);
			assert.deepEqual(parkingDataUtils.getQuadTreeDataFromApiData(parkingData2["data"]), parkingData2);
    		})
  	})
})


// getMeanValueOfParkingDataArrayValidationTest
describe('ParkingDataUtils', function() {
  	describe('#getMeanValueOfParkingDataArray()', function() {
    		it('getMeanValueOfParkingDataArrayValidationTest', function() {

			var meanAvlData = parkingDataUtils.getMeanValueOfParkingDataArray(avlDataArray);

			assert.equal(meanAvlData["location"].x, avlDataArayLocation.x);
			assert.equal(meanAvlData["location"].y, avlDataArayLocation.y);
			assert.equal(meanAvlData["data"]["OCC"], avlDataArayOccupation);
			assert.equal(meanAvlData["data"]["OPER"], avlDataArayCapacity);
    		})
  	})
})

// getMeanValueOfParkingDataArrayValidationTest
describe('ParkingDataUtils', function() {
  	describe('#getMeanValueOfParkingDataArray()', function() {
    		it('whenThereIsASingleElementInTheArrayItIsReturnedAsTheMeanValue', function() {

			var singleElementArray = [parkingData1];
			var meanAvlData = parkingDataUtils.getMeanValueOfParkingDataArray(singleElementArray);

			assert.deepEqual(meanAvlData, parkingData1);
    		})
  	})
})
