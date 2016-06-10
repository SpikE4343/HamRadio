var fs = require('fs');
var nedb = require('nedb');

//
// Link file marker to data mapping
// TODO: move to memory map service
//
var mapping = {
	'AH034$' : 'ftm-400'
};

//
// TODO: data drive mappings
//       add crud gui for mappings
//       use mapping to generate typeset
//
var dataMapping = {
	'ftm-400': {
    "model" : 'ftm-400',
    "fileMarker": 'AH034$',
		"items": {
			"channel": {
			"size": 16,
			"fields": {
				"frequency": {
					"label": "Frequency",
					"units": "Mhz",
					"encoding": "bcd",
					"start": 2,
					"size": 3
				},
				"name": {
				  "label": "Label",
				  "ref" : "labels",
					"encoding": "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!\"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ???????????????????????????????????????????????????????????????????????????????????????????",
				  "start": 0,
				  "size": 8
				},
				"mode": {
					"label": "Mode",
					"encoding": [
						"FM",
						"AM",
						"NFM",
						"",
						"WFM"
					],
					"bits": [
						9,
						3,
						false
					]
				},
				"power": {
					"label": "Power",
					"encoding": [
						"Hi",
						"Mid",
						"Low"
					],
					"bits": [
						72,
						2,
						false
					]
				},
				"duplex": {
					"label": "Duplex",
					"encoding": [
						"",
						"",
						"-",
						"+",
						"split"
					],
					"bits": [
						14,
						2,
						false
					]
				},
				"offset": {
					"label": "Offset",
					"encoding": [],
					"bits": [
						104,
						8,
						false
					]
				},
				"tmode": {
					"label": "TMode",
					"encoding": [
						"",
						"Tone",
						"TSQL",
						"-RVT",
						"DTCS",
						"-PR",
						"-PAG"
					],
					"bits": [
						41,
						3,
						false
					]
				},
				"tone": {
					"label": "Tone",
					"encoding": [],
					"bits": [
						74,
						2,
						false
					]
				},
				"dtcs": {
					"label": "DTCS",
					"encoding": [],
					"bits": [
						81,
						7,
						false
					]
				},

				"used": {
					"label": "Used",
					"encoding": "bool",
					"show": false,
					"bits": [
						0,
						1,
						false
					]
				},
				"skip": {
					"label": "Skip",
					"encoding": "bool",
					"bits": [
						1,
						2,
						false
					]
				},

				"oddsplit": {
					"label": "Odd Split",
					"encoding": "bool",
					"bits": [
						13,
						1,
						false
					]
				},

				"showalpha": {
					"label": "Show Alpha",
					"encoding": "bool",
					"bits": [
						88,
						1,
						false
					]
				},

				"split": {
					"label": "Split",
					"units": "Mhz",
					"encoding": "bcd",
					"start": 6,
					"size": 3
				}
			}
			},
			"label": {
			"size": 8,
			"fields": {
				"label": {
					"label": "Label",
					"encoding": {
						"type": "string",
						"mapping": "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!\"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ???????????????????????????????????????????????????????????????????????????????????????????"
					},
					"start": 0,
					"size": 8
				}
			}
			}
		}
	}
};

angular
	.module('app')
	.service('dataMapService', [
		'$q',
	function ($q) {
		self = this;
    self.db = new nedb( {
      filename: 'data/mapping.db',
      autoload: true
    });

    //
		// fetch all saved mappings
		//
		self.list = function(){
			var d = $q.defer();

      self.db.find({})
        .sort({ 'model': 1 })
        .limit(5)
        .exec(function (err, docs) {
           if( err )
            d.reject( err );
           else
            d.resolve( docs );
      });

			return d.promise;
		};
	}
]);
