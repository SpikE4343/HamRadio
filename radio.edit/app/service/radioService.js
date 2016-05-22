var fs = require('fs');
var jBinary = require('jbinary');

var ftm400Memory = {
  'jBinary.littleEndian': true,
  'jBinary.all': 'memory',

  channel: {
// uint8
    used: [ 'bitfield', 1],
    skip: [ 'bitfield', 2],
    unknown1: ['bitfield', 5],
// uint8
    unknown2: ['bitfield', 1],
    mode: ['bitfield', 3],
    unknown3: ['bitfield', 1],
    oddsplit: ['bitfield', 1],
    duplex: ['bitfield', 2],
// uint8 * 3
    frequency: ['array',['bitfield', 4], 6 ],
// uint8
    unknown4: [ 'bitfield', 1],
    tmode: ['bitfield', 3],
    unknown5: [ 'bitfield', 4],
// uint8 * 3
    split: ['array',['bitfield', 4], 6 ],
// uint8
    power: [ 'bitfield', 2],
    tone: [ 'bitfield', 6],
// uint8
    unknown6: [ 'bitfield', 1],
    dtcs: [ 'bitfield', 7],
// uint8
    showalpha: [ 'bitfield', 1],
    unknown7: [ 'bitfield', 7],
// unit8
    unknown8: 'uint8',
    offset: 'uint8',
    unknown9: ['array','uint8', 2],
  },

	band: {
		channels: [ 'array', 'channel', 500]
	},

  label: ['array', 'char', 8],
	labels: [ 'array', 'label', 518 ],

	home: {
		channel: 'channel',
		label: 'labels'
	},

	options: {
		callsign: ['string', 10]
	},

	memory: {
		tag: ['string', 6],
    unknown1: ['blob', 690],
    settings: 'options',

		unknown2: ['blob', 1342],

		// home: ['array', 'home', 2],
    //radio0: 'channel',
    //label0: 'label',
    //radio1: 'channel',
    //label1: 'label',

		bands: ['array', 'band', 2],
    labels: ['array', 'labels', 2],
	}
};


// TODO: move to memory map service
var mapping = {
	'AH034$' : 'ftm-400'
};

angular
	.module('app')
	.service('radioService', [
		'$q', 'RadioFactory',
	function ($q, RadioFactory) {
		self = this;
		self.saves = [{
				name:'KK6UGN',
				file:'kk6ugn-ftm-400.dat',
				model:'FTM-400',
				vender:'Yaesu',
				typeset: ftm400Memory,
	      map:{
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
	            // "name": {
	            //   "label": "Label",
	            //   "ref" : "labels.label",
	            //   "start": 0,
	            //   "size": 8
	            // },
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
	      }}
			},
			{
				name:'KK6NLW',
				file:'kk6nlw-ftm-400.dat',
				model:'FTM-400',
				vender:'Yaesu',
				typeset: ftm400Memory
			}
		];

		self.list = function(){
			var d = $q.defer();

			setTimeout(function(){
				d.resolve(self.saves);
			}, 10);

			return d.promise;
		};

		self.loadMappings = function (){
			// parse all .json files in mapping folder
			// linking file.marker -> filename
		};

		//
		// create radio and read from save data at id
		//
		self.load = function( id ) {
			var radio = RadioFactory(self.saves[id]);
			return radio.load( 'app/data/saves/' );
		};

		//
		// get save file data by index
		//
		self.radioInfo = function( id ){
			return self.saves[id];
		};
	}
]);
