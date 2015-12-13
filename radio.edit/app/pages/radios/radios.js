var bf = require('binary-file');
var fs = require('fs');

angular.module('app')
       .controller('MainPageController', ['radioService', '$q', '$mdDialog', MainPageController]);

function MainPageController(radioService, $q, $mdDialog) {
	var self = this;
	self.radios = [];
	self.selected = null;
  self.error = null;

	self.load = function()
	{
    radioService.load( 'kk6nlw-ftm-400.dat' )
      .then( function( radio )
      {
        self.radios.push( radio );
        console.log(radio);
      },
      function(error)
      {
          self.error = error;
      });
	};

	self.selectRadio = function( radio, index )
	{
		self.selected = radio;
	};

	self.load();
}
