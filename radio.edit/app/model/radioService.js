angular.module('app')
	.service('ftm400Service', ['$q', ftm400Service]);


var bcd = require('bcd');
var bit = require('bit-buffer');
var fs = require('fs');

var mapping = {
	'AH034$' : 'ftm-400'
}

function radioService($q)
{
	return {
		load: loadRadio,
		save: saveRadio,
	};

	function buildRadioFromMap( mmap )
	{
		var radio = {
			map: mmap,
			vendor: mmap.vendor,
			name: mmap.name,
			error: '',
			settings: {},
			bands: []
		};

		for (var def in mmap.bands )
		{
			var band = {
				name: def.name,
				channels: [],
				labels: []
			};

			radio.bands.push( band );
		}

		return radio;
	}

	function loadRadio( filename )
	{
		var p = $q.defer();
		fs.readFile( filename, function(err, data )
		{
			if( err )
			{
				p.reject( "Unable to load file: " + err);
				return;
			}

			var marker = buffer.toString('ascii', 0, fileMarker.length);
			if( !mapping.hasOwnProperty( marker ))
			{
				p.reject( "Unkown file type: " + marker );
				return;
			}

			var mapFile = mapping[marker];

			fs.readFile( mapfile + '.json', function (err, data){
					if( err )
					{
						p.reject( 'Unable to load mapping file: ' + mapfile );
						return;
					}

					var mmap = JSON.parse(data);
					var radio = buildRadioFromMap( mmap );
			});
		});

		return p.promise;




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
