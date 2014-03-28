var assert = require('assert');
var infoExtractor = require('../parkingInfoExtractor.js');

var testStr1 = 'Arrêt int. 7h30 - 16h LUN À VEN PÉRIODE SCOLAIRE (fl. dou.)';
var testStr1Data = {
		'LUN': 1, 'MAR': 1, 'MER': 1, 'JEU': 1, 'VEN': 1, 'SAM': 0, 'DIM': 0,
		'time_intervals': [ { startTime: '7h30', endTime: '16h' } ],
		'date_begin': 'en période scolaire', 'date_end': 'hors période scolaire',
		'parking_allowed': false,  
		'allocated_time': '0',
		'authorization_label': 'none'
	};


var testStr2 = 'Stat. 120 min 8h - 18h LUN-MER-VEN (fl. dou.)';
var testStr2Data = {
		'LUN': 1, 'MAR': 0, 'MER': 1, 'JEU': 0, 'VEN': 1, 'SAM': 0, 'DIM': 0,
		'time_intervals': [ { startTime: '8h', endTime: '18h' } ],
		'date_begin': '01-01', 'date_end': '31-12',
		'parking_allowed': true,  
		'allocated_time': '120',
		'authorization_label': 'none'
	};

var testStr3 = 'Stat. int. 8h - 17h 1er SEPT AU 1er JUILL (fl. dou.) (Ville Ancienne-Lorette)';
var testStr3Data = {
		'LUN': 1, 'MAR': 1, 'MER': 1, 'JEU': 1, 'VEN': 1, 'SAM': 1, 'DIM': 1,
		'time_intervals': [ { startTime: '8h', endTime: '17h' } ],
		'date_begin': '01-09', 'date_end': '01-07',
		'parking_allowed': false,  
		'allocated_time': '0',
		'authorization_label': 'none'
	};

var testStr4 = '1er SEPT AU 1er JUILL (fl. dou.)';
var testStr4Data = {
		'LUN': 1, 'MAR': 1, 'MER': 1, 'JEU': 1, 'VEN': 1, 'SAM': 1, 'DIM': 1,
		'time_intervals': [ { startTime: '00h00', endTime: '23h59' } ],
		'date_begin': '01-09', 'date_end': '01-07',
		'parking_allowed': true,  
		'allocated_time': '-1',
		'authorization_label': 'none'
	};

var testStr5 = "Stat. int. 9h30 - 10h, 14h - 14h30 LUN-MER-VEN (fl. dou.) EXCEPTÉ PERMIS ZONE A3-1 (bleu)";
var testStr5Data = {
		'LUN': 1, 'MAR': 0, 'MER': 1, 'JEU': 0, 'VEN': 1, 'SAM': 0, 'DIM': 0,
		'time_intervals': [ { startTime: '9h30', endTime: '10h' }, { startTime: '14h', endTime: '14h30' }],
		'date_begin': '01-01', 'date_end': '31-12',
		'parking_allowed': false,  
		'allocated_time': '0',
		'authorization_label': 'A3-1'
	};

var testStr6 = "Stat. 120 min 8h - 16h LUN-MER-VEN EXCEPTÉ VÉH. ZONE A3-3 (fl. dr.) (vert)";
var testStr6Data = {
		'LUN': 1, 'MAR': 0, 'MER': 1, 'JEU': 0, 'VEN': 1, 'SAM': 0, 'DIM': 0,
		'time_intervals': [ { startTime: '8h', endTime: '16h' } ],
		'date_begin': '01-01', 'date_end': '31-12',
		'parking_allowed': true,  
		'allocated_time': '120',
		'authorization_label': 'A3-3'
	};

var testStr7 = "Panonceau EXCEPTÉ VÉHICULES MUNIS D'UN PERMIS DE STATIONNEMENT ZONE A3-11";
var testStr7Data = {
		'LUN': 1, 'MAR': 1, 'MER': 1, 'JEU': 1, 'VEN': 1, 'SAM': 1, 'DIM': 1,
		'time_intervals': [ { startTime: '00h00', endTime: '23h59' } ],
		'date_begin': '01-01', 'date_end': '31-12',
		'parking_allowed': false,  
		'allocated_time': '0',
		'authorization_label': 'A3-11'
	};

var testStr8 = "Stat. 90 min 9h - 16h LUIN À VEN (fl. ga.)";
var testStr8Data = {
		'LUN': 1, 'MAR': 1, 'MER': 1, 'JEU': 1, 'VEN': 1, 'SAM': 0, 'DIM': 0,
		'time_intervals': [ { startTime: '9h', endTime: '16h' } ],
		'date_begin': '01-01', 'date_end': '31-12',
		'parking_allowed': true,  
		'allocated_time': '90',
		'authorization_label': 'none'
	};

// validation of returned data
describe('parkingInfoExtractor', function() {
  	describe('#getParkingInfo()', function() {
    		it('parkingInfoExtractorDataValidation', function() {

      			assert.deepEqual(infoExtractor.getParkingInfo(testStr1).parsedData, testStr1Data);
			assert.deepEqual(infoExtractor.getParkingInfo(testStr2).parsedData, testStr2Data);
			assert.deepEqual(infoExtractor.getParkingInfo(testStr3).parsedData, testStr3Data);
			assert.deepEqual(infoExtractor.getParkingInfo(testStr4).parsedData, testStr4Data);
			assert.deepEqual(infoExtractor.getParkingInfo(testStr5).parsedData, testStr5Data);
			assert.deepEqual(infoExtractor.getParkingInfo(testStr6).parsedData, testStr6Data);
			assert.deepEqual(infoExtractor.getParkingInfo(testStr7).parsedData, testStr7Data);
			assert.deepEqual(infoExtractor.getParkingInfo(testStr8).parsedData, testStr8Data);
    		})
  	})
})
