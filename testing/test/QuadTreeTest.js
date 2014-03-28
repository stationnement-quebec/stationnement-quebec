var assert = require('assert');
var QuadTree = require('../QuadTree.js');
var BoundingBox = require('../BoundingBox.js');
var parkingDataUtils = require('../ParkingDataUtils.js');


var data = {
	"STATUS":"SUCCESS",
	"NUM_RECORDS":260,
	"MESSAGE":"260 Records found",
	"AVAILABILITY_UPDATED_TIMESTAMP":"2014-03-23T19:04:58.250-04:00",
	"AVAILABILITY_REQUEST_TIMESTAMP":"2014-03-23T19:05:28.000-04:00",
	"AVL":
	[
		{
			"TYPE":"ON",
			"NAME":"1005 - 1023 Rue Saint-Jean",
			"BFID":"105209",
			"OCC":4,
			"OPER":5,
			"PTS":"1",
			"LOC":"-40,-40"
		},
		{
			"TYPE":"ON",
			"NAME":"1220 Place George-V Ouest",
			"BFID":"102355",
			"OCC":3,
			"OPER":8,
			"PTS":"1",
			"LOC":"-20,-40"
		},
		{
			"TYPE":"ON",
			"NAME":"1210 - 1230 Place George-V Ouest",
			"BFID":"102355",
			"OCC":0,
			"OPER":9,
			"PTS":"1",
			"LOC":"-40,-20"
		},
		{
			"TYPE":"ON",
			"NAME":"5 - 11 Rue Sainte-Ursule",
			"BFID":"105530",
			"OCC":0,
			"OPER":5,
			"PTS":"1",
			"LOC":"-20,-20"
		},
		{
			"TYPE":"ON",
			"NAME":"88 Côte de la Montagne",
			"BFID":"106835",
			"OCC":1,
			"OPER":6,
			"PTS":"1",
			"LOC":"-25,-25"
		},
		{
			"TYPE":"ON",
			"NAME":"37 - 51 Quai Saint-André",
			"BFID":"104829",
			"OCC":1,
			"OPER":6,
			"PTS":"1",
			"LOC":"25,25"
		},
		{
			"TYPE":"ON",
			"NAME":"2 - 20 Rue Port-Dauphin",
			"BFID":"103984",
			"OCC":5,
			"OPER":23,
			"PTS":"1",
			"LOC":"20,20"
		},
		{
			"TYPE":"ON",
			"NAME":"20 - 48 Côte du Palais",
			"BFID":"103905",
			"OCC":5,
			"OPER":5,
			"PTS":"1",
			"LOC":"40,20"
		},
		{
			"TYPE":"ON",
			"NAME":"511 - 571 Rue Saint-Jean",
			"BFID":"105201",
			"OCC":3,
			"OPER":10,
			"PTS":"1",
			"LOC":"20,40"
		},
		{
			"TYPE":"OFF",
			"NAME":"Complexe Marie-Guyart",
			"DESC":"1050 Rue Louis-Alexandre-Taschereau",
			"INTER":"4 bourgeois",
			"TEL":"",
			"OSPID":"101018",
			"OCC":1461,
			"OPER":1468,
			"PTS":"1",
			"LOC":"40,40"
		}
	]
};


function fillQuadTree() {
	for(var i = 0; i < data["AVL"].length; i++)
		quadtree.insert(parkingDataUtils.getQuadTreeDataFromApiData(data["AVL"][i]));
}

var bounds = new BoundingBox(0,0,50,50);
var quadtree = new QuadTree(bounds);

fillQuadTree();

var bbox1 = new BoundingBox(0,0,5,5);
var objectsInBBox1 = 0;

var bbox2 = new BoundingBox(0,0,50,50);
var objectsInBBox2 = 10;

var bbox3 = new BoundingBox(0,0,30,30);
var objectsInBBox3 = 4;

var bbox4 = new BoundingBox(25,25,25,25);
var bbox4_meanAvlData = {
	"TYPE":"ON",
	"NAME":"",
	"BFID":"",
	"OCC":1475,
	"OPER":1512,
	"PTS":"1",
	"LOC":"29,29"
}
var bbox5 = new BoundingBox(-25,-25,25,25);
var bbox5_meanAvlData = {
	"TYPE":"ON",
	"NAME":"",
	"BFID":"",
	"OCC":8,
	"OPER":33,
	"PTS":"1",
	"LOC":"-29,-29"
}

describe('QuadTree', function() {
  	describe('#queryRange()', function() {
    		it('whenNoObjectsAreWithinTheProvidedAreaItReturnsAnEmptyArray', function() {

			var objects1 = quadtree.queryRange(bbox1);
      			assert.equal(objects1.length,objectsInBBox1);
    		})
  	})
})

describe('QuadTree', function() {
  	describe('#queryRange()', function() {
    		it('whenObjectsAreWithinTheProvidedAreaItReturnsThem', function() {

			var objects2 = quadtree.queryRange(bbox2);
			var objects3 = quadtree.queryRange(bbox3);
      			assert.equal(objects2.length,objectsInBBox2);
      			assert.equal(objects3.length,objectsInBBox3);
    		})
  	})
})

describe('QuadTree', function() {
  	describe('#queryRange()', function() {
    		it('clusteringValidationTest', function() {

			var objects4 = quadtree.queryRange(bbox4, 0);
      			assert.equal(objects4.length,1);
			assert.deepEqual(objects4[0]["data"], bbox4_meanAvlData);
			
			var objects5 = quadtree.queryRange(bbox5, 0);
			assert.equal(objects5.length,1);
			assert.deepEqual(objects5[0]["data"], bbox5_meanAvlData);
    		})
  	})
})
