var parkingLabelPattern = new RegExp(/EXCEPTÉ (VÉHICULES MUNIS D'UN PERMIS DE STATIONNEMENT|PERMIS|VÉH.){1} ZONE (\S+)/);
var hoursIntervalPattern = new RegExp(/\d+h\d*\s-\s\d+h\d*/g);
var dateIntervalPattern = new RegExp(/(\d{1,2})\w{0,2} (\w{3,5}) AU (\d{1,2})\w{0,2} (\w{3,5})/);
var daysIntervalPattern = new RegExp(/(\w{3,4})\sÀ\s(\w{3,4})/);
var specifiedDaysPattern = new RegExp(/(\w{3}-)+(\w{3})\s/);
var temporaryParkingPattern = new RegExp(/Stat. (\d+) min/);
var forbiddenParkingPattern = new RegExp(/Stat. int./);
var forbiddenStopPattern = new RegExp(/Arrêt int./);
var dayPattern = new RegExp(/\w{3}/g);
var hourPattern = new RegExp(/\d+h\d*/g);

var days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
var daysID = {'LUN': 1, 'LUIN': 1, 'MAR': 2, 'MER': 3, 'JEU': 4, 'VEN': 5, 'SAM': 6, 'DIM': 7};

var monthsID = {
	'JAN': '01', 'FÉV': '02', 'MARS': '03', 'AVRIL': '04', 'MAI': '05', 'JUIN': '06', 
	'JUILL': '07', 'AOUT': '08', 'SEP': '09', 'SEPT': '09', 'OCT': '10', 'NOV': '11', 'DÉC': '12'
};


function getPanelDaysInEffectFromString(descriptionString) {

	var daysInEffect;
	var temp = descriptionString.match(daysIntervalPattern);

	if (temp != null) {
		var startDay = daysID[temp[1]];
		var endDay = daysID[temp[2]];

		daysInEffect = fillDayInterval(startDay, endDay);
	}
	else {
		temp = descriptionString.match(specifiedDaysPattern);
		if (temp != null)
			daysInEffect = temp[0].match(dayPattern);
		else 
			daysInEffect = fillDayInterval(1, 7);
	} 
	return daysInEffect;
}


function getPanelHoursInEffectFromString(descriptionString) {

	var timeInEffect;
	var temp = descriptionString.match(hoursIntervalPattern);

	if(temp != null) {	
		// check for all time intervals
		timeInEffect = new Array(temp.length);
		for (var i = 0; i < temp.length; i++) {

			var interval = temp[i].match(hourPattern);
			timeInEffect[i] = new TimeInterval(interval[0], interval[1]);
		}
	}	
	else { 
		timeInEffect = new Array(1);
		timeInEffect[0] = new TimeInterval('00h00', '23h59');
	}

	return timeInEffect;
}


function getPanelDateInEffectFromString(descriptionString)
{
	var datesInEffect = new Array(2);
	var temp = descriptionString.match(dateIntervalPattern);

	if (temp != null) {
		datesInEffect[0] = getFormattedDate(temp[1], temp[2]);
		datesInEffect[1] = getFormattedDate(temp[3], temp[4]);
	}
	else {	
		var schoolPeriod = new RegExp(/PÉRIODE SCOLAIRE/);
		temp = descriptionString.match(schoolPeriod);	
		
		if(temp != null) {
			datesInEffect[0] = 'en période scolaire';
			datesInEffect[1] = 'hors période scolaire';
		}
		else {
			datesInEffect[0] = '01-01';
			datesInEffect[1] = '31-12';
		}
	}
	
	return datesInEffect;
}


function getParkingAuthorizationAndPeriodFromString(descriptionString) {

	var authorizationAndTime = new Array(2);	
	var temp = descriptionString.match(temporaryParkingPattern);

	if(temp != null) {
		authorizationAndTime[0] = true;
		authorizationAndTime[1] = temp[1];
	}
	else { 
		if (forbiddenParkingPattern.test(descriptionString) || forbiddenStopPattern.test(descriptionString)) {
			authorizationAndTime[0] = false;
			authorizationAndTime[1] = 0;
		}
		else {
			authorizationAndTime[0] = true;
			authorizationAndTime[1] = -1;
		}
	}

	return authorizationAndTime;
}


function getParkingLabelAuthorization(descriptionString) {

	var authorizationLabel  = 'none';
	var temp = descriptionString.match(parkingLabelPattern);

	if (temp != null) {
		authorizationLabel = temp[2];
	}

	return authorizationLabel;
}


function getFormattedDate(day, month) {

	var formatedDay = day;
	if (day < 10)
		formatedDay = '0' + day;
	
	return (formatedDay + '-' + monthsID[month]);
}

function fillDayInterval(startDayID, endDayID) {

	var interval;
	if(startDayID < endDayID) {
	
		interval = new Array(endDayID - startDayID + 1);
		for (var i = startDayID; i <= endDayID; i++)
			interval[i-1] = days[i-1];
	}
	else {
	
		interval = new Array(endDayID + (7 - startDayID) + 1);
		var i;
		for (i = 0; i < endDayID; i++)
			interval[i] = days[i];
			
		for (var j = endDayID + (7 - startDayID); j >= i; j--)
			interval[j] = days[j+1];
	}
	return interval;
}

function TimeInterval(startTime,endTime) {
	this.startTime = startTime;
	this.endTime = endTime;
}

function formatStringData(descriptionString) {

	var formattedString = "";

	var parkingAllowed = getParkingAuthorizationAndPeriodFromString(descriptionString);
	if (parkingAllowed[0] == true) {

		if (parkingAllowed[1] != "-1")
			formattedString = "Stationnement " + parkingAllowed[1] + " minutes\n";
		else
			formattedString = "Stationnement permis\n"
	}
	else
		formattedString = "Stationnement interdit \n";

	var time = getPanelHoursInEffectFromString(descriptionString);
	if ((time != null) && (time[0].startTime != '00h00') && (time[0].endTime != '23h59')) 
		for (var i = 0; i < time.length; i++) 
			formattedString = formattedString.concat("De " + time[i].startTime + " à " + time[i].endTime +"\n");

	var days = descriptionString.match(daysIntervalPattern);
	if (days != null) 
		formattedString = formattedString.concat(days[0] + "\n");
	else {
		days = descriptionString.match(specifiedDaysPattern);
		if (days != null)
			formattedString = formattedString.concat(days[0] + "\n");
	}

	var period = getPanelDateInEffectFromString(descriptionString);
	if (period[0] == 'en période scolaire')
		formattedString = formattedString.concat("Pendant la période scolaire\n");
	else if ((period[0] == '01-01') && (period[1] == '31-12'))	
		formattedString = formattedString.concat("Tout au long de l'année\n");
	else 
		formattedString = formattedString.concat("Du " + period[0] + " au " + period[1] + " (JJ-MM)\n");



	return formattedString;
}

module.exports.formatStringData = formatStringData;
module.exports.getPanelDaysInEffectFromString = getPanelDaysInEffectFromString;
module.exports.getPanelHoursInEffectFromString = getPanelHoursInEffectFromString;
module.exports.getPanelDateInEffectFromString = getPanelDateInEffectFromString;
module.exports.getParkingAuthorizationAndPeriodFromString = getParkingAuthorizationAndPeriodFromString;
module.exports.getParkingLabelAuthorization = getParkingLabelAuthorization;
module.exports.TimeInterval = TimeInterval;
