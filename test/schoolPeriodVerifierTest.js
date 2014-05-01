var assert = require('assert');
var periodVerifier = require('../infoExtraction/schoolPeriodVerifier.js');

var dateInAutumnSchoolPeriod = new Date(2014, 10, 12, 9, 30, 0, 0);
var dateInWinterSchoolPeriod = new Date(2014, 1, 12, 19, 30, 0, 0);
var dateOutsideSchoolPeriod1 =  new Date(2014, 11, 25, 9, 30, 0, 0);
var dateOutsideSchoolPeriod2 =  new Date(2014, 7, 11, 9, 30, 0, 0);

// whenTheDateIsInsideASchoolPeriodItReturnsTrue
describe('schoolPeriodVerifier', function() {
  	describe('#isTheDateInSchoolPeriod()', function() {
    		it('whenTheDateIsInsideASchoolPeriodItReturnsTrue', function() {

			assert.equal(periodVerifier.isTheDateInSchoolPeriod(dateInAutumnSchoolPeriod), true);
			assert.equal(periodVerifier.isTheDateInSchoolPeriod(dateInWinterSchoolPeriod), true);
    		})
  	})
})

// whenTheDateIsOutsideASchoolPeriodItReturnsFalse
describe('schoolPeriodVerifier', function() {
  	describe('#isTheDateInSchoolPeriod()', function() {
    		it('whenTheDateIsOutsideASchoolPeriodItReturnsFalse', function() {

			assert.equal(periodVerifier.isTheDateInSchoolPeriod(dateOutsideSchoolPeriod1), false);
			assert.equal(periodVerifier.isTheDateInSchoolPeriod(dateOutsideSchoolPeriod2), false);
    		})
  	})
})

