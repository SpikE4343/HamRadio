angular.module('app')
	.service('ftm400Service', ['$q', ftm400Service]);

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

var settings = [ 
	{
		callsign: [696, 10]
	}
];

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

	
	function decodeFrequenceMhz( rawUint32BE )
	{
		var decodeFreqMask = parseInt('0x0000000F');
		var bcd = rawUint32BE >> 8;
		
		var parts = [];
		for (var index = 0; index < 6; index++) {
			parts[index] = (bcd >> ( index * 4 )) & decodeFreqMask;
		}
			
		var freq = 0;
		for( var i=0; i < parts.length; ++i)
		{
			freq += (parts[i] * Math.pow( 10, i)) * 10000;			
		}
		
		return freq / 1000000.0;
	}
	
	function readMemory(memStart, radio, subRadio, buffer) {
		for (var i = 0; i < memoryChannels; ++i) {
			var start = memStart + i * channelSize;
			var end = start + channelSize;
			
			var rawStart = buffer.readUInt8( start );
			
			if( rawStart >> 7 == 0 )
				break; 
			
			var rawFreq = buffer.readUInt32BE(start+2);
			
			
			
			var channel = {
				start: start,
				end: end,
				raw: buffer.slice(start, end),
				freq: decodeFrequenceMhz( rawFreq ),
				rawFreq: rawFreq
				
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
