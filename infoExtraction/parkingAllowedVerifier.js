/** With a given date and parsed parking value, tell if we can park at that place */
var schoolPeriodVerifier = require('./schoolPeriodVerifier.js');

var snowClearingStart = '23h';
var snowClearingEnd = '6h30';
var parsedTimePattern = new RegExp(/(\d+)h(\d*)/);
var parsedDatePattern = new RegExp(/(\d{2})-(\d{2})/);
var days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

function isItPossibleToParkAtThisTime(date, dataOfThePanel, authorization_label) {

	var panelData = dataOfThePanel.parsedData;

	if ((authorization_label == panelData['authorization_label']) && (authorization_label != 'none'))
		return true;

	var month = getUsableMonth(date);
	var dayOfTheMonth = date.getDate();
	var dayOfTheWeek = getUsableDayOfWeek(date);
	var timeInMinute = date.getHours() * 60 + date.getMinutes();


	if (panelData['parking_allowed'] == false)
		return isItPossibleToParkWhenItsAParkingForbiddenSign(panelData, date, month, dayOfTheMonth, dayOfTheWeek, timeInMinute);
	else
		return isItPossibleToParkWhenItsAParkingAllowedSign(panelData, date, month, dayOfTheMonth, dayOfTheWeek, timeInMinute);
}


function isItPossibleToParkWhenItsAParkingForbiddenSign(panelData, date, month, dayOfTheMonth, dayOfTheWeek, timeInMinute) {

	var timeInterval = panelData['time_intervals'][0];
	if ( (timeInterval.startTime == snowClearingStart) && (timeInterval.endTime == snowClearingEnd) )
		return false;

	if (doesTheMonthAndDayFitThePanelInterval(panelData, date, month, dayOfTheMonth) == false)
		return true;

	if (doesTheDayOfTheWeekFitInThePanelInterval(panelData, dayOfTheWeek) == false)
		return true;

	if (doesTheTimeFitInThePanelInterval(panelData, timeInMinute) == false)
		return true;

	return false;
}


function isItPossibleToParkWhenItsAParkingAllowedSign(panelData, date, month, dayOfTheMonth, dayOfTheWeek, timeInMinute) {

	var dateIsOk = doesTheMonthAndDayFitThePanelInterval(panelData, date, month, dayOfTheMonth);
	var dayOfTheWeekIsOk = doesTheDayOfTheWeekFitInThePanelInterval(panelData, dayOfTheWeek);
	var timeIsOK = doesTheTimeFitInThePanelInterval(panelData, timeInMinute);

	return ((dateIsOk == true) && (dayOfTheWeekIsOk == true) && (timeIsOK == true));
}


function doesTheMonthAndDayFitThePanelInterval(panelData, date, month, dayOfTheMonth) {

	if (panelData['date_begin'] == 'en période scolaire')
		return isItSchoolPeriod(date);

	var dateBegin = panelData['date_begin'].match(parsedDatePattern);
	var dateEnd = panelData['date_end'].match(parsedDatePattern);

	var month_begin = parseInt(dateBegin[2]);
	var month_end = parseInt(dateEnd[2]);

	var okForMonth;		var invertedMonthCheck = false;
	if (month_begin > month_end) {
		invertedMonthCheck = true;
		var t = month_begin;
		month_begin = month_end;
		month_end = t;
	}

	okForMonth = ((month >= month_begin) && (month <= month_end));
	if (invertedMonthCheck == true)
		okForMonth = !okForMonth;


	var okForDay = true;
	if(month == month_begin)
		okForDay = (dayOfTheMonth >= parseInt(dateBegin[1]));

	else if(month == month_end)
		okForDay = (dayOfTheMonth <= parseInt(dateEnd[1]));


	return ((okForMonth == true) && (okForDay == true));
}


function doesTheDayOfTheWeekFitInThePanelInterval(panelData, dayOfTheWeek) {

	var d = days[dayOfTheWeek];
	return (panelData[d] == 1);
}


function doesTheTimeFitInThePanelInterval(panelData, timeInMinute) {

	var timeIntervals = panelData['time_intervals'];
	var lowerLimit, upperLimit;

	for (var i = 0; i < timeIntervals.length; i++) {

		lowerLimit = parseTimeIntoMinute(timeIntervals[i].startTime);
		upperLimit = parseTimeIntoMinute(timeIntervals[i].endTime);

		if((timeInMinute >= lowerLimit) && (timeInMinute < upperLimit))
			return true;
	}
	return false;
}

function isItSchoolPeriod(date) {

	return schoolPeriodVerifier.isTheDateInSchoolPeriod(date);
}

function getUsableMonth(date) {
	return date.getMonth() + 1;
}

function getUsableDayOfWeek(date) {

	var usableDate = date.getDay() - 1;
	if (usableDate == -1) {usableDate = 6;}
	return usableDate;
}

function parseTimeIntoMinute(time) {

	var temp = time.match(parsedTimePattern);

	var hour = parseInt(temp[1])
	var minute = 0;

	if (temp[2].length > 0)
		minute = parseInt(temp[2]);

	return ((hour * 60) + minute);
}

module.exports.isItPossibleToParkAtThisTime = isItPossibleToParkAtThisTime;
