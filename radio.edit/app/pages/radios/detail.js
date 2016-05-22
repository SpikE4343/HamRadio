
angular.module('app')
       .controller('DetailController',
          ['radioService',
           '$q',
           '$mdDialog',
           '$stateParams',
           DetailController]);

function DetailController(radioService, $q, $mdDialog, $stateParams) {
	var self = this;
  self.id = $stateParams.id;
	self.radio = null;
  self.error = null;
  self.channelLimit = 5;

	self.load = function( id )
	{
    radioService.load( id )
      .then( function( radio )
      {
        self.radio = radio;
        console.log(radio);
      },
      function(error)
      {
          self.error = error;
      });
	};

  self.getFieldData = function( radio, band, channel, name){
    return radioService.getFieldData( radio, band, channel, name);
  };

	self.load(self.id);
}
