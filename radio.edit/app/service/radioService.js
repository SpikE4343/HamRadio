angular.module('app')
	.service('radioService', ['$q', radioService]);


var bcd = require('bcd');
var bit = require('bit-buffer');
var fs = require('fs');

var mapping = {
	'AH034$' : 'ftm-400'
}

var saves = [
	{
		name:'kk6ugn',
		file:'kk6ugn-ftm-400.dat',
		model:'FTM-400',
		vender:'Yaesu'
	},

	{
		name:'kk6nlw',
		file:'kk6nlw-ftm-400.dat',
		model:'FTM-400',
		vender:'Yaesu'
	}
];

function radioService($q)
{
	function list()
	{
		var d = $q.defer();

		setTimeout(function(){
			d.resolve(saves);
		}, 10);
		return d.promise;
	}

	function loadMappings()
	{
		// parse all .json files in mapping folder
		// linking file.marker -> filename
	}

	function buildRadioFromMap( mmap )
	{
		var radio = {
			map: mmap,
			vendor: mmap.vendor,
			name: mmap.model,
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
		fs.readFile( filename, function( err, data )
		{
			if( err )
			{
				p.reject( "Unable to load file: " + err);
				return;
			}

			// read in beginning of config
			var marker = data.toString('ascii', 0, 6);
			if( !mapping.hasOwnProperty( marker ) )
			{
				p.reject( "Unkown file type: " + marker );
				return;
			}

			var mapFile = mapping[marker];

			fs.readFile( 'app/data/maps/'+mapFile+'.json', function (maperr, mapData)
			{
					if( maperr )
					{
						p.reject( 'Unable to load mapping file: ' + mapfile );
						return;
					}

					var mmap = JSON.parse(mapData);
					var radio = buildRadioFromMap( mmap );
					parseRadio( radio, data);

					p.resolve( radio );
			});
		});

		return p.promise;
	}

  function parseSettings( settings, map, buffer )
	{
		for (var name in map)
		{
			var setting = map[name];
			if( setting.type === 'string' )
			{
				settings[name] =
						buffer.toString(
							setting.encoding,
							setting.start,
							setting.start+setting.size);
			}
			else if( setting.type === 'group')
			{
				settings[name] = {group:true};
				parseSettings( settings[name], setting, buffer);
			}
		}
	}

	function parseField( channel, name, def, buffer, bits)
	{
		var value = null;
		if( def.hasOwnProperty('bits'))
		{
			value = bits.getBits( def.bits[0], def.bits[1], def.bits[2]);
		}

		if( def.encoding === 'bcd' )
		{
			value = bcd.decode(buffer.slice(def.start, def.start+def.size));
		}
		//else if( def.encoding === '' )

		channel.data[name] = value;
	}

	function parseChannels( channels, def, itemdef, buffer)
	{
		for (var i = 0; i < def.count; ++i)
		{
			var start = def.start + i * itemdef.size;
			var end = start + itemdef.size;

			var bytes = buffer.slice(start, end);
			var bits = new bit.BitView( bytes );

			var channel = {
				id: i+1,
				start: start,
				end: end,
				data: {}
			};

			for (var f in itemdef.fields ) {
					parseField( channel, f, itemdef.fields[f], bytes, bits  );
			}

			channels.push( channel );
		}
	}

	function parseBand( band, map, def, buffer)
	{
		band.name = def.name;
		band.page = 0;
		band.channels = [];
		var itemdef = map.items[def.channels.item];
		parseChannels(band.channels, def.channels, itemdef, buffer );
	}

	function parseBands( bands, map, buffer )
	{
		for (var id in map.bands) {
			var def = map.bands[id];
			var band = bands[id] = {};
			parseBand(band, map, def, buffer );
		}
	}

	function parseRadio( radio, buffer )
	{
		var map = radio.map;
		parseSettings( radio.settings, map.settings, buffer );
		parseBands( radio.bands, map, buffer );
	}

	function saveRadio(file, radio)
	{

	}

	return {
		load: loadRadio,
		save: saveRadio,
		list: list
	};
}
