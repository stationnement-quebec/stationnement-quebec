/** Provides a clean API for parsing of parking description */

var infoParser = require('./parkingInfoParser.js');
var parkingAllowedVerifier = require('./parkingAllowedVerifier.js');

function getParkingInfo(descriptionString) {

	var daysArray = infoParser.getPanelDaysInEffectFromString(descriptionString);
	var timeArray = infoParser.getPanelHoursInEffectFromString(descriptionString);
	var dateArray = infoParser.getPanelDateInEffectFromString(descriptionString);
	var authorizationAndTime = infoParser.getParkingAuthorizationAndPeriodFromString(descriptionString);
	var authorizationLabel = infoParser.getParkingLabelAuthorization(descriptionString);

	var data = fillReturnedData(daysArray, timeArray, dateArray, authorizationAndTime[0], authorizationAndTime[1], authorizationLabel);
	var description = infoParser.formatStringData(descriptionString);

	return new ParsedData(data,description);
}


function isItOkToParkAtThisTime(date, panelData, authorization_label) {

	if (authorization_label == 'undefined')
		authorization_label = 'none';

	return parkingAllowedVerifier.isItPossibleToParkAtThisTime(date, panelData, authorization_label);
}


function fillReturnedData(daysArray, timeArray, dateArray, parkingAuthorized, parkingPeriod, authorizationLabel) {

	var data = {
		'LUN': 0, 'MAR': 0, 'MER': 0, 'JEU': 0, 'VEN': 0, 'SAM': 0, 'DIM': 0, 	// 0 = not applied on this day, 1 = applied
		'time_intervals': null,
		'date_begin': '01-01', 'date_end': '31-12',				// DD-MM
		'parking_allowed': false,
		'allocated_time': '0',							// allocated time in minutes (-1 means no limit)
		'authorization_label': 'none'
	};

	// flag active days as 1
	for(var i = 0; i < daysArray.length; i++)
		data[daysArray[i]] = 1;

	data['time_intervals'] = timeArray;

	data['date_begin'] = dateArray[0];
	data['date_end'] = dateArray[1];

	data['parking_allowed'] = parkingAuthorized;
	data['allocated_time'] = parkingPeriod;
	data['authorization_label']  = authorizationLabel;

	if ((authorizationLabel != 'none') && (parkingPeriod == -1)) {
		data['parking_allowed'] = false;
		data['allocated_time'] = 0;
	}

	return data;
}

function ParsedData(data,description) {
	this.parsedData = data;
	this.description = description;
}

module.exports.ParsedData = ParsedData;
module.exports.getParkingInfo = getParkingInfo;
module.exports.isItOkToParkAtThisTime = isItOkToParkAtThisTime;
