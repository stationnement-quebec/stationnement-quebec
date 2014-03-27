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


function getQuadTreeDataFromApiData(avlData) {

	return { "data": avlData, "location": getNumericLatLongFromApiData(avlData)};
} 


function getMeanValueOfParkingDataArray(parkingDataArray) {

	var meanLongitude = 0;
	var meanLatitude = 0;
	var totalOccupation = 0;
	var totalCapacity = 0;

	var numberOfObjects = parkingDataArray.length;
	if(numberOfObjects == 1)
		return parkingDataArray[0];

	for(var i = 0; i < numberOfObjects; i++) {

		var location = getNumericLatLongFromApiData(parkingDataArray[i]["data"]);
		meanLongitude += location.x;
		meanLatitude += location.y;

		totalOccupation += parkingDataArray[i]["data"]["OCC"];
		totalCapacity += parkingDataArray[i]["data"]["OPER"];
	}

	meanLongitude /= numberOfObjects;
	meanLatitude /= numberOfObjects;

	var avlData = templateAVLData;
	avlData["OCC"] = totalOccupation;
	avlData["OPER"] = totalCapacity;
	avlData["LOC"] = meanLongitude.toString() + "," + meanLatitude.toString();

	return { "data": templateAVLData, "location": getNumericLatLongFromApiData(avlData)};
}


function getNumericLatLongFromApiData(avlData) {
	var points = avlData["LOC"].split(",");
	return { x: parseFloat(points[0]), y: parseFloat(points[1]) };
}
