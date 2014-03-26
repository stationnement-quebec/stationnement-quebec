function PayingParkingData(avlData) {

	this.avlData = avlData;
	this.availableParking = avlData["OPER"] - avlData["OCC"];
	this.location = getNumericLatLongFromApiData(avlData);


	this.getNumericLatLongFromApiData = getNumericLatLongFromApiData;
	function getNumericLatLongFromApiData(avlData) {
		var points = avlData["LOC"].split(",");
		return { latitude: parseFloat(points[1]), longitude: parseFloat(points[0]) };
	}
}
