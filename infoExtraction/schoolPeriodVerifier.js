var schoolPeriodAutumnStart = new Date();
var schoolPeriodAutumnEnd = new Date();
var schoolPeriodWinterStart = new Date();
var schoolPeriodWinterEnd = new Date();

schoolPeriodAutumnStart.setDate(1);
schoolPeriodAutumnStart.setMonth(8);

schoolPeriodAutumnEnd.setDate(20);
schoolPeriodAutumnEnd.setMonth(11);

schoolPeriodWinterStart.setDate(7);
schoolPeriodWinterStart.setMonth(1);

schoolPeriodWinterEnd.setDate(25);
schoolPeriodWinterEnd.setMonth(5);

function isTheDateInSchoolPeriod(date) {

	if ((date.getTime() >= schoolPeriodAutumnStart.getTime()) && (date.getTime() <= schoolPeriodAutumnEnd.getTime()))
		return true;

	if ((date.getTime() >= schoolPeriodWinterStart.getTime()) && (date.getTime() <= schoolPeriodWinterEnd.getTime()))
		return true;

	return false;
}

module.exports.isTheDateInSchoolPeriod = isTheDateInSchoolPeriod;
