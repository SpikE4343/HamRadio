var bcd = require('bcd');
var bit = require('bit-buffer');
var fs = require('fs');

// TODO: move to memory map service
var mapping = {
	'AH034$' : 'ftm-400'
};

angular.module('app')
	.service('radioService', function ($q)
{
	self = this;

	self.saves = [
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

	self.list = function()
	{
		var d = $q.defer();

		setTimeout(function(){
			d.resolve(self.saves);
		}, 10);
		return d.promise;
	};

	self.loadMappings = function ()
	{
		// parse all .json files in mapping folder
		// linking file.marker -> filename
	};

	self.buildRadioFromMap = function( mmap )
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
	};

	self.load = function( id )
	{
		return self.loadRadio( 'app/data/saves/' + self.saves[id].file );
	};

	self.loadRadio = function ( filename )
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
					var radio = self.buildRadioFromMap( mmap );
					self.parseRadio( radio, data );

					p.resolve( radio );
			});
		});

		return p.promise;
	};

  self.parseSettings = function ( settings, map, buffer )
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
				self.parseSettings( settings[name], setting, buffer);
			}
		}
	};

	self.parseField = function ( label, name, def, buffer, bits)
	{
		var value = null;
		if( def.hasOwnProperty('bits'))
		{
			value = bits.getBits( def.bits[0], def.bits[1], def.bits[2]);
		}

		if( def.hasOwnProperty('ref'))
		{
			value = { _ref: def['ref']};
		}

		if( def.encoding === 'bcd' )
		{
			value = bcd.decode(buffer.slice(def.start, def.start+def.size));
		}
		else if( Array.isArray( def.encoding) )
		{
			value = def.encoding[value];
		}
		else if( typeof( def.encoding ) === 'object')
		{
			var rawLabel = buffer.slice(def.start, def.start+def.size);
			var mapping = def.encoding['mapping'];
			value = "";
			for (var i = 0; i < def.size; i++) {
				value += mapping.charAt(rawLabel[i]);
			}
		}
		//else if( def.encoding === '' )

		label.data[name] = value;
	};

	self.parseChannels = function ( channels, def, itemdef, buffer)
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

			self.channel = channel;

			for (var f in itemdef.fields ) {
					self.parseField( channel, f, itemdef.fields[f], bytes, bits  );
			}

			channels.push( channel );
		}
	};

	self.parseLabels = function ( labels, def, itemdef, buffer)
	{
		for (var i = 0; i < def.count; ++i)
		{
			var start = def.start + i * itemdef.size;
			var end = start + itemdef.size;

			var bytes = buffer.slice(start, end);
			var bits = new bit.BitView( bytes );

			var label = {
				id: i+1,
				start: start,
				end: end,
				data: {}
			};

			for (var f in itemdef.fields ) {
					self.parseField( label, f, itemdef.fields[f], bytes, bits  );
			}

			labels.push( label );
		}
	};

	self.parseBand = function ( band, map, def, buffer)
	{
		self.band = band;
		var itemdef = map.items[def.channels.item];
		self.parseChannels(band.channels, def.channels, itemdef, buffer );

		var labeldef = map.items[def.labels.item ];
		self.parseLabels( band.labels, def.labels, labeldef, buffer);
	};

	self.parseBands = function ( bands, map, buffer )
	{
		for (var id in map.bands) {
			var def = map.bands[id];
			var band = bands[id] = {
				name: def.name,
				page: 1,
				channels: [],
				labels: []
			};
			self.parseBand(band, map, def, buffer );
		}
	};

	self.parseRadio = function( radio, buffer )
	{
		var map = radio.map;
		self.buffer = buffer;
		self.parseSettings( radio.settings, map.settings, buffer );
		self.parseBands( radio.bands, map, buffer );
	};

	self.save = function(file, radio)
	{

	};

	self.getFieldData = function( id, band, channel, name ){
		var data = channel.data[name];
		if( data._ref !== undefined)
		{
			var ref = data._ref.split('.');
			data = band[ref[0]][id].data[ref[1]];
		}

		return data;
	};

	self.radioInfo = function( id )
	{
		return self.saves[id];
	};
});
