var bf = require('binary-file');
var fs = require('fs');

angular.module('app')
       .controller('MainPageController', ['ftm400Service', '$q', '$mdDialog', MainPageController]);
    
function MainPageController(ftm400Service, $q, $mdDialog) {
	var self = this;
	self.radios = [];
	self.selected = null;
	
	self.load = function()
	{
		fs.readFile( 'kk6nlw-ftm-400.dat', function (err, data) {
			
			if( err )
				throw err;
			
			var radio = ftm400Service.load( data );
			console.log( radio );
			self.radios.push(radio);			
		});
	};
	
	self.selectRadio = function( radio, index )
	{
		self.selected = radio;	
	};
	
	self.load();
}
	
	