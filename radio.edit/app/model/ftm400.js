angular.module('app')
	.service('ftm400Service', ['$q', ftm400Service]);


var bcd = require('bcd');
var bit = require('bit-buffer');
var fs = require('fs');

var fileMarker = "AH034$";
var memoryChannels = 500;
var memoryChannelLabels = 518;
var channelSize = 16;
var labelSize = 8;
var memoryAStart = 2048;
var memoryBStart = 10336;

var memoryALabelStart = 18624;
var memoryBLabelStart = memoryALabelStart + memoryChannelLabels * labelSize;

var labelCharSet = '0123456789' +
				   'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
				   'abcdefghijklmnopqrstuvwxyz' +
				   '!"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ' +
				   '????????????????????????????????????????' +
				   '????????????????????????????????????????' +
				   '???????????';

var _TMODES = ['', 'Tone', 'TSQL', '-RVT', 'DTCS', '-PR', '-PAG'];
var TMODES = ['', 'Tone', 'TSQL', '', 'DTCS', '', ''];
var MODES = ['FM', 'AM', 'NFM', '', 'WFM'];
var DUPLEXES = ['', '', '-', '+', 'split'];
// TODO: add japaneese characters (viewable in special menu, scroll backwards)

var POWER_LEVELS = [ 'Hi', 'Mid', 'Low' ];

var SKIPS = ['', 'S', 'P']


var ftm400_map =
{
	vendor: 'Yaesu',
	model: 'FTM-400',

	file: {
		marker: 'AH034$',
		size: 65536
	},

	serial: {
		buad: 48000
	},

	settings:
	{
		callsign:
		{
			start: 0x2B8,
			size: 10,
			encoding: 'ascii',
			fill: 255
		},
		aprs:{
			callsign:
			{
				start: 0x508,
				size: 8,
				encoding: 'ascii',
				fill: 202
			},
		}
	},

	bands:
	[
		{
			name:'A',
			channels: { type:'array', start: 2048, item:'channel', count: 500 },
			labels: { type:'array', start: 18624, item:'label', count:518 }
		},
		{
			name:'B',
			channels: { type:'array', start: 10336, item:'channel', count: 500 },
			labels: { type: 'array', start: 22768, item:'label', count: 518 }
		}
	],

s	channel:
	{
		size: 16,
		fields:
		{
			used:
			{
				label: 'Used',
				encoding: 'bool',
				bits: [0, 1, false]
			},

			skip:
			{
				label: 'Skip',
				encoding: 'bool',
				bits: [1, 2, false]
			},

			mode:
			{
				label: 'Mode',
				encoding: ['FM', 'AM', 'NFM', '', 'WFM'],
				bits: [9, 3, false]
			},

			oddsplit:
			{
				label: 'Odd Split',
				encoding: 'bool',
				bits: [13, 1, false]
			},

			duplex:
			{
				label: 'Duplex',
				encoding: ['', '', '-', '+', 'split'],
				bits: [14, 2, false]
			},

			tmode:
			{
				label: 'Transmit Mode',
				encoding: ['', 'Tone', 'TSQL', '-RVT', 'DTCS', '-PR', '-PAG'],
				bits: [41, 3, false]
			},

			power:
			{
				label: 'Transmit Power',
				encoding: [ 'Hi', 'Mid', 'Low' ],
				bits: [72, 2, false]
			},

			tone:
			{
				label: 'Transmit Tone',
				encoding: [],
				bits: [74, 2, false]
			},

			dtcs:
			{
				label: 'DTCS',
				encoding: [],
				bits: [81, 7, false]
			},

			showalpha:
			{
				label: 'Show Alpha',
				encoding: 'bool',
				bits: [88, 1, false]
			},

			offset:
			{
				label: 'Offset',
				encoding: [],
				bits: [104, 8, false]
			},

			freq:
			{
				label: 'Frequency',
				units: 'Mhz',
				encoding: 'bcd',
				start: 2,
				size: 3
			},

			split:
			{
				label: 'Frequency Split',
				units: 'Mhz',
				encoding: 'bcd',
				start: 6,
				size: 3
			}
		}
	},

	label: {
		size: 8,
		fields:
		{
			label:
			{
				label: 'Label',
				encoding: '0123456789' +
					'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
					'abcdefghijklmnopqrstuvwxyz' +
					'!"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ' +
					'????????????????????????????????????????' +
					'????????????????????????????????????????' +
					'???????????',
				start:0,
				size:8
			},
		}
	}
};

function ftm400Service($q) {
	return {
		load: loadRadio,
		save: saveRadio,
	};


	function loadRadio(buffer) {
		//buffer = new Buffer(100);
	    fs.writeFile( 'app/data/maps/ftm-400.json', JSON.stringify(ftm400_map, undefined, 2) );

		var radio = {
			name: 'FTM-400',
			error: '',
			map: ftm400_map,
			data: {},
			settings: {},
			bands: [{
					name: 'A',
					channels: [],
				  	labels: [],
					max: 500
				}, {
					name: 'B',
					channels: [],
				  	labels: [],
					max: 500
				}
			]
		};

		var marker = buffer.toString('ascii', 0, fileMarker.length);
		if (marker !== fileMarker) {
			radio.error = "Unkown file type: " + marker;
			return radio;
		}

		radio.data.size = buffer.length;
		radio.settings.callsign = buffer.slice( 696, 696 + 10).toString();//buffer.toString('ascii', 696, 10);

		radio.marker = marker;

		readMemory(memoryAStart, radio, 0, buffer);
		readMemory(memoryBStart, radio, 1, buffer);

		readLabel(memoryALabelStart, radio, 0, buffer);
		readLabel(memoryBLabelStart, radio, 1, buffer);

		return radio;
	}


	function decodeFrequenceMhz( buffer )
	{
		return 0;
	}

	function encodeFrequenceMhz( freq )
	{
		return bcd.encode(freq*100.0, 3);
	}

	function setChannelData( channel, channelDataInfo, bitBuffer )
	{

	}

	function readMemory(memStart, radio, subRadio, buffer) {
		for (var i = 0; i < memoryChannels; ++i) {
			var start = memStart + i * channelSize;
			var end = start + channelSize;

			var bits = new bit.BitView( buffer.slice(start, end));
			var used = bits.getBits( 0, 1, false);


			if( used == 0 )
				continue;


			var freqStart = start +2;

			var channel = {
				id: i+1,
				start: start,
				end: end,
				raw: buffer.slice(start, end),

				data: {
					used: [used, used ? true : false],
					skip: [bits.getBits( 1, 2, false), false],
					mode: bits.getBits( 9, 3, false),
					oddsplit: bits.getBits( 13, 1, false),
					duplex: bits.getBits( 14, 2, false),
					tmode: bits.getBits( 41, 3, false),
					power: bits.getBits( 72, 2, false),
					tone: bits.getBits( 74, 2, false),
					dtcs: bits.getBits( 81, 7, false),
					showalpha: bits.getBits( 88, 1, false),
					offset: bits.getBits( 104, 8, false ),
					freq: bcd.decode(buffer.slice(freqStart, freqStart+3 ))/100,
					split: bcd.decode(buffer.slice(freqStart+4, freqStart+4+3 ))/100,
				}
				  //decodeFrequenceMhz( rawFreq ),
			};

			channel.data["used"] = []

			radio.bands[subRadio].channels[i] = channel;
		}
	}

	function decodeLabelString( rawLabel )
	{
		var label = "";
		for (var index = 0; index < rawLabel.length; index++) {
			var char = rawLabel[index];
			if(char == 202 )
				break;

			label += labelCharSet[char];
		}

		return label;
	}

	function readLabel(memStart, radio, subRadio, buffer) {
		for (var i = 0; i < memoryChannelLabels; ++i) {
			var start = memStart + i * labelSize;
			var end = start + labelSize;

			var label = decodeLabelString( buffer.slice(start, end) );

			radio.bands[subRadio].labels[i] = label;
		}
	}

	function saveRadio(file, radio) {

	}
}
