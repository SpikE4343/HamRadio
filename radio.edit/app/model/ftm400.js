angular.module('app')
	.service('ftm400Service', ['$q', ftm400Service]);


var bcd = require('bcd');
var bit = require('bit-buffer');

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

var ftm400_map = 
{
	model:'FTM-400',
	fileMarker: '',
	
	settings: 
	{
		callsign: [696, 10],
		aprs:{
			callsign: [0,0, 'ascii']
		}
	},
	
	bands:
	{
		labels:518,
		channel:
		{
			count: 500,
			size: 16,
			fields:
			[
				{ name: ''},
				{ name: 'freq',
				  encoding: 'bcd',
				  size: 3,}
			]
		},
		
		label: {
			count: 518,
			size: 8,
			
			charSet: '0123456789' +
				     'ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
				     'abcdefghijklmnopqrstuvwxyz' + 
				     '!"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ' + 
				     '????????????????????????????????????????' +
				     '????????????????????????????????????????' +
				     '???????????' 	
		},
		
		memory:
		[
			{
				name:'A',
				channels: [2048, 500 * 16]
			},
			{
				name:'B',
				channels: [10336, 500 * 16]
			}
		]
	}
};

function ftm400Service($q) {
	return {
		load: loadRadio,
		save: saveRadio,
	};


	function loadRadio(buffer) {
		//buffer = new Buffer(100);
	
		var radio = {
			name: 'FTM-400',
			error: "",
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
		return freq;
	}
	
	function encodeFrequenceMhz( freq )
	{
		return bcd.encode(freq*100.0, 3);
	}
	
	function readMemory(memStart, radio, subRadio, buffer) {
		for (var i = 0; i < memoryChannels; ++i) {
			var start = memStart + i * channelSize;
			var end = start + channelSize;
			
			var bits = bit.bitView( buffer, start, channelSize );
			
			var rawStart = buffer.readUInt8( start );
			
			if( rawStart >> 7 == 0 )
				continue; 
			
			var rawFreq = buffer.readUInt32BE(start+2);
			var freqStart = start +2;
			
			var channel = {
				id: i,
				start: start,
				end: end,
				raw: buffer.slice(start, end),
				freq: bcd.decode(buffer.slice(freqStart, freqStart+3 )),
				  //decodeFrequenceMhz( rawFreq ),
			};
			
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
