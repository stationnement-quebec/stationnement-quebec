var assert = require('assert');
var infoExtractor = require('../parkingInfoExtractor.js');
var parkingAllowedVerifier = require('../parkingAllowedVerifier.js');


var authorization_label1 = 'A3-3';
var parkingAllowed1 = infoExtractor.getParkingInfo("Stat. 120 min 8h - 16h LUN-MER-VEN EXCEPTÉ VÉH. ZONE A3-3 (fl. dr.) (vert)");
	var goodDateForParkingAllowed1 = new Date(2014, 2, 12, 9, 30, 0, 0);
	var badHourForParkingAllowed1 = new Date(2014, 2, 12, 19, 30, 0, 0);
	var badDayOfWeekforParkingAllowed1 =  new Date(2014, 2, 11, 9, 30, 0, 0);

var parkingForbidden1 = infoExtractor.getParkingInfo("Stat. int. 9h30 - 10h, 14h - 14h30 LUN-MER-VEN  EXCEPTÉ VÉH. ZONE A3-3 (fl. dr.) (vert)");
	var goodDateForParkingForbidden1 = new Date(2014, 2, 12, 12, 0, 0, 0);
	var badHour1ForParkingForbidden1 = new Date(2014, 2, 12, 9, 45, 0, 0);
	var badHour2ForParkingForbidden1 = new Date(2014, 2, 12, 14, 15, 0, 0);
	var goodDayOfWeekforParkingForbidden1 =  new Date(2014, 2, 11, 9, 30, 0, 0);

var parkingForbidden2 = infoExtractor.getParkingInfo('Stat. int. 8h - 17h 1er SEPT AU 1er JUILL (fl. dou.) (Ville Ancienne-Lorette)');
	var badDateForParkingForbidden2 = new Date(2014, 2, 12, 12, 0, 0, 0);
	var goodDateForParkingForbidden2 = new Date(2014, 7, 12, 12, 0, 0, 0);

var parkingForbidden3 = infoExtractor.getParkingInfo("Arrêt int. 7h30 - 16h LUN À VEN PÉRIODE SCOLAIRE (fl. dou.)");
	var badDateForParkingForbidden3 = new Date(2014, 2, 12, 10, 30, 0, 0);
	var goodDateForParkingForbidden3 = new Date(2014, 7, 12, 12, 0, 0, 0);

// whenTheUserHasTheRightAuthorizationLabelItReturnsTrue
describe('parkingAllowedVerifier', function() {
  	describe('#isItPossibleToParkAtThisTime()', function() {
    		it('whenTheUserHasTheRightAuthorizationLabelItReturnsTrue', function() {

			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(new Date(), parkingAllowed1, authorization_label1),true);
      			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(new Date(), parkingForbidden1, authorization_label1),true);
    		})
  	})
})


// whenAllDateAttributesFitInAParkingAllowedPanelIntervalItReturnsTrue
describe('parkingAllowedVerifier', function() {
  	describe('#isItPossibleToParkAtThisTime()', function() {
    		it('whenAllDateAttributesFitInAParkingAllowedPanelIntervalItReturnsTrue', function() {

			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(goodDateForParkingAllowed1, parkingAllowed1, 'none'),true);
    		})
  	})
})


// whenTheTimeIsOutsideAParkingAllowedPanelIntervalItReturnsFalse
describe('parkingAllowedVerifier', function() {
  	describe('#isItPossibleToParkAtThisTime()', function() {
    		it('whenTheTimeIsOutsideAParkingAllowedPanelIntervalItReturnsFalse', function() {

			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(badHourForParkingAllowed1, parkingAllowed1, 'none'),false);
    		})
  	})
})

// whenTheDayOfTheWeekOutsideAParkingAllowedPanelIntervalItReturnsFalse
describe('parkingAllowedVerifier', function() {
  	describe('#isItPossibleToParkAtThisTime()', function() {
    		it('whenTheDayOfTheWeekOutsideAParkingAllowedPanelIntervalItReturnsFalse', function() {

			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(badDayOfWeekforParkingAllowed1, parkingAllowed1, 'none'),false);
    		})
  	})
})


// whenADateAttribueIsOutsideAParkingForbiddenPanelIntervalItReturnsTrue
describe('parkingAllowedVerifier', function() {
  	describe('#isItPossibleToParkAtThisTime()', function() {
    		it('whenADateAttribueIsOutsideAParkingForbiddenPanelIntervalItReturnsTrue', function() {

			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(goodDateForParkingForbidden1, parkingForbidden1, 'none'),true);
			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(goodDayOfWeekforParkingForbidden1, parkingForbidden1, 'none'),true);
			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(goodDateForParkingForbidden2, parkingForbidden2, 'none'),true);
			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(goodDateForParkingForbidden3, parkingForbidden3, 'none'),true);
    		})
  	})
})


// whenAllDateAttributesFitInAParkingForbiddenPanelIntervalItReturnsFalse
describe('parkingAllowedVerifier', function() {
  	describe('#isItPossibleToParkAtThisTime()', function() {
    		it('whenAllDateAttributesFitInAParkingForbiddenPanelIntervalItReturnsFalse', function() {

			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(badHour1ForParkingForbidden1, parkingForbidden1, 'none'),false);
			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(badHour2ForParkingForbidden1, parkingForbidden1, 'none'),false);
			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(badDateForParkingForbidden3, parkingForbidden3, 'none'),false);
    		})
  	})
})


// whenADateFitInAParkingForbiddenPanelIntervalItReturnsFalse
describe('parkingAllowedVerifier', function() {
  	describe('#isItPossibleToParkAtThisTime()', function() {
    		it('whenADateFitInAParkingForbiddenPanelIntervalItReturnsFalse', function() {

			assert.equal(parkingAllowedVerifier.isItPossibleToParkAtThisTime(badDateForParkingForbidden2, parkingForbidden2, 'none'),false);
    		})
  	})
})

