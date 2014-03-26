var templateAVLData = {
	"TYPE":"ON",
	"NAME":"",
	"BFID":"",
	"OCC":0,
	"OPER":0,
	"PTS":"1",
	"LOC":""
}


function createBoundingBoxFromMapBounds(mapBounds) {

	var halfWidth 	= (mapBounds['max'].longitude - mapBounds['min'].longitude) / 2;
	var halfHeight 	= (mapBounds['max'].latitude - mapBounds['min'].latitude) / 2;
	
	var x = mapBounds['min'].longitude + halfWidth;
	var y = mapBounds['min'].latitude + halfHeight;

	return new BoundingBox(x,y,halfWidth, halfHeight);
}


function getMeanValueOfParkingDataArray(parkingDataArray) {

	var meanLongitude = 0;
	var meanLatitude = 0;
	var totalOccupation = 0;
	var totalCapacity = 0;

	var numberOfObjects = parkingDataArray.length;

	for(var i = 0; i < numberOfObjects; i++) {

		meanLongitude += parkingDataArray[i].location.longitude;
		meanLatitude += parkingDataArray[i].location.latitude;
		totalOccupation += parkingDataArray[i].avlData["OCC"];
		totalCapacity += parkingDataArray[i].avlData["OPER"];
	}

	meanLongitude /= numberOfObjects;
	meanLatitude /= numberOfObjects;

	var avlData = templateAVLData;
	avlData["OCC"] = totalOccupation;
	avlData["OPER"] = totalCapacity; 
	avlData["LOC"] = meanLongitude.toString() + "," + meanLatitude.toString();

	return (new PayingParkingData(avlData));
}

