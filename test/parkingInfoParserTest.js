var assert = require('assert');
var infoParser = require('../infoExtraction/parkingInfoParser.js');

var testStr1 = 'Arrêt int. 7h30 - 16h LUN À VEN PÉRIODE SCOLAIRE (fl. dou.)';
var testStr1ActiveDay = ['LUN', 'MAR', 'MER', 'JEU', 'VEN'];
var testStr1ActiveTime = [ { startTime: '7h30', endTime: '16h' } ];
var testStr1DateInterval = ['en période scolaire', 'hors période scolaire'];
var testStr1AuthorizationAndTime = [false, 0];
var testStr1LabelAuthorization = 'none';

var testStr2 = 'Stat. 120 min 8h - 18h LUN-MER-VEN (fl. dou.)';
var testStr2ActiveDay = ['LUN', 'MER', 'VEN'];
var testStr2ActiveTime = [ { startTime: '8h', endTime: '18h' } ];
var testStr2DateInterval = ['01-01', '31-12'];
var testStr2AuthorizationAndTime = [true, 120];
var testStr2LabelAuthorization = 'none';

var testStr3 = 'Stat. int. 8h - 17h 1er SEPT AU 1er JUILL (fl. dou.) (Ville Ancienne-Lorette)';
var testStr3ActiveDay = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
var testStr3ActiveTime = [ { startTime: '8h', endTime: '17h' } ];
var testStr3DateInterval = ['01-09', '01-07'];
var testStr3AuthorizationAndTime = [false, 0];
var testStr3LabelAuthorization = 'none';

var testStr4 = '1er SEPT AU 1er JUILL (fl. dou.)';
var testStr4ActiveDay = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
var testStr4ActiveTime = [ { startTime: '00h00', endTime: '23h59' } ];
var testStr4DateInterval = ['01-09', '01-07'];
var testStr4AuthorizationAndTime = [true, -1];
var testStr4LabelAuthorization = 'none';

var testStr5 = "Panonceau EXCEPTÉ VÉHICULES MUNIS D'UN PERMIS DE STATIONNEMENT ZONE A3-11";
var testStr5LabelAuthorization = 'A3-11';

var testStr6 = "Stat. int. 9h30 - 10h, 14h - 14h30 LUN-MER-VEN (fl. dou.) EXCEPTÉ PERMIS ZONE A3-1 (bleu)";
var testStr6ActiveTime = [ { startTime: '9h30', endTime: '10h' }, { startTime: '14h', endTime: '14h30' } ];
var testStr6LabelAuthorization = 'A3-1';

var testStr7 = "Stat. 120 min 8h - 16h LUN-MER-VEN EXCEPTÉ VÉH. ZONE A3-3 (fl. dr.) (vert)";
var testStr7LabelAuthorization = 'A3-3';

var testStr8 = "Stat. int. 0h - 18h DIM À VEN 15 NOV AU 31 MARS (fl. dou.)";
var testStr8ActiveDay = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'DIM'];

// whenADayIntervalIsSpecifiedThisIntervalIsActive
describe('parkingInfoParser', function() {
	describe('#getPanelDaysInEffectFromString()', function() {
		it('whenADayIntervalIsSpecifiedThisIntervalIsActive', function() {

			assert.deepEqual(infoParser.getPanelDaysInEffectFromString(testStr1), testStr1ActiveDay);
			assert.deepEqual(infoParser.getPanelDaysInEffectFromString(testStr8), testStr8ActiveDay);
		})
	})
})


// whenIndividualDaysAreSpecifiedOnlyThemAreActive
describe('parkingInfoParser', function() {
	describe('#getPanelDaysInEffectFromString()', function() {
		it('whenIndividualDaysAreSpecifiedOnlyThemAreActive', function() {

			assert.deepEqual(infoParser.getPanelDaysInEffectFromString(testStr2), testStr2ActiveDay);
		})
	})
})


// whenThereIsNoInformationOnTheActiveDayTheWholeWeekIsActive
describe('parkingInfoParser', function() {
	describe('#getPanelDaysInEffectFromString()', function() {
		it('whenThereIsNoInformationOnTheActiveDayTheWholeWeekIsActive', function() {

			assert.deepEqual(infoParser.getPanelDaysInEffectFromString(testStr3), testStr3ActiveDay);
		})
	})
})


// whenATimePeriodIsSpecifiedOnlyThisPeriodIsActive
describe('parkingInfoParser', function() {
	describe('#getPanelHoursInEffectFromString()', function() {
		it('whenATimePeriodIsSpecifiedOnlyThisPeriodIsActive', function() {

			assert.deepEqual(infoParser.getPanelHoursInEffectFromString(testStr1), testStr1ActiveTime);
			assert.deepEqual(infoParser.getPanelHoursInEffectFromString(testStr2), testStr2ActiveTime);
			assert.deepEqual(infoParser.getPanelHoursInEffectFromString(testStr3), testStr3ActiveTime);
		})
	})
})


// whenMultipleTimePeriodAreSpecifiedTheyAreAllConsideredActive
describe('parkingInfoParser', function() {
	describe('#getPanelHoursInEffectFromString()', function() {
		it('whenMultipleTimePeriodAreSpecifiedTheyAreAllConsideredActive', function() {

			assert.deepEqual(infoParser.getPanelHoursInEffectFromString(testStr6), testStr6ActiveTime);
		})
	})
})

// whenNoTimePeriodIsSpecifiedTheWholeDayIsActive
describe('parkingInfoParser', function() {
	describe('#getPanelHoursInEffectFromString()', function() {
		it('whenNoTimePeriodIsSpecifiedTheWholeDayIsActive', function() {

			assert.deepEqual(infoParser.getPanelHoursInEffectFromString(testStr4), testStr4ActiveTime);
		})
	})
})


// whenADateIntervalIsSpecified
describe('parkingInfoParser', function() {
	describe('#getPanelDateInEffectFromString()', function() {
		it('whenADateIntervalIsSpecifiedThisIntervalIsReturned', function() {

			assert.deepEqual(infoParser.getPanelDateInEffectFromString(testStr1), testStr1DateInterval);
		})
	})
})


// whenSchoolPeriodIsSpecifiedOnlySchoolPeriodIsReturned
describe('parkingInfoParser', function() {
	describe('#getPanelDateInEffectFromString()', function() {
		it('whenSchoolPeriodIsSpecifiedOnlySchoolPeriodIsReturned', function() {

			assert.deepEqual(infoParser.getPanelDateInEffectFromString(testStr2), testStr2DateInterval);
		})
	})
})


// whenNoDateIsSpecifiedTheWholeYearIsReturned
describe('parkingInfoParser', function() {
	describe('#getPanelDateInEffectFromString()', function() {
		it('whenNoDateIsSpecifiedTheWholeYearIsReturned', function() {

			assert.deepEqual(infoParser.getPanelDateInEffectFromString(testStr3), testStr3DateInterval);
		})
	})
})


// whenNoStopAreAllowedParkingIsNotAllowed
describe('parkingInfoParser', function() {
	describe('#getParkingAuthorizationAndPeriodFromString()', function() {
		it('whenNoStopAreAllowedParkingIsNotAllowed', function() {

			assert.deepEqual(infoParser.getParkingAuthorizationAndPeriodFromString(testStr1), testStr1AuthorizationAndTime);
		})
	})
})


// whenATimeLimitIsSpecifiedParkingIsAllowedOnlyForThisPeriod
describe('parkingInfoParser', function() {
	describe('#getParkingAuthorizationAndPeriodFromString()', function() {
		it('whenATimeLimitIsSpecifiedParkingIsAllowedOnlyForThisPeriod', function() {

			assert.deepEqual(infoParser.getParkingAuthorizationAndPeriodFromString(testStr2), testStr2AuthorizationAndTime);
		})
	})
})


// whenParkingForbiddenIsSpecifiedParkingIsNotAllowed
describe('parkingInfoParser', function() {
	describe('#getParkingAuthorizationAndPeriodFromString()', function() {
		it('whenParkingForbiddenIsSpecifiedParkingIsNotAllowed', function() {

			assert.deepEqual(infoParser.getParkingAuthorizationAndPeriodFromString(testStr3), testStr3AuthorizationAndTime);
		})
	})
})


// whenNoTimeLimitArSpecifiedParkingIsAllowed
describe('parkingInfoParser', function() {
	describe('#getParkingAuthorizationAndPeriodFromString()', function() {
		it('whenNoTimeLimitArSpecifiedParkingIsAllowed', function() {

			assert.deepEqual(infoParser.getParkingAuthorizationAndPeriodFromString(testStr4), testStr4AuthorizationAndTime);
		})
	})
})


// whenAnAuthorizationLabelIsMentionedItIsReturned
describe('parkingInfoParser', function() {
	describe('#getParkingLabelAuthorization()', function() {
		it('whenNoTimeLimitArSpecifiedParkingIsAllowed', function() {
			
			assert.deepEqual(infoParser.getParkingLabelAuthorization(testStr5), testStr5LabelAuthorization);
			assert.deepEqual(infoParser.getParkingLabelAuthorization(testStr6), testStr6LabelAuthorization);
			assert.deepEqual(infoParser.getParkingLabelAuthorization(testStr7), testStr7LabelAuthorization);
		})
	})
})


// whenNoAuthorizationLabelIsMentionedItsAssumedThatThereIsNone
describe('parkingInfoParser', function() {
	describe('#getParkingLabelAuthorization()', function() {
		it('whenNoAuthorizationLabelIsMentionedItsAssumedThatThereIsNone', function() {

			assert.deepEqual(infoParser.getParkingLabelAuthorization(testStr1), testStr1LabelAuthorization);
			assert.deepEqual(infoParser.getParkingLabelAuthorization(testStr2), testStr2LabelAuthorization);
			assert.deepEqual(infoParser.getParkingLabelAuthorization(testStr3), testStr3LabelAuthorization);
			assert.deepEqual(infoParser.getParkingLabelAuthorization(testStr4), testStr4LabelAuthorization);				
		})
	})
})
