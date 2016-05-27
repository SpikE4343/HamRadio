
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
  self.channelLimit = 10;
  self.query = { order: "id"};
  self.tableView = false;
  self.selected = [];
  self.selection = {};
  self.transFilter = "";

	self.load = function( id ){
    radioService.load( id )
      .then( function( radio ){
        self.radio = radio;
        console.log(radio);
      },function(error){
          self.error = error;
      });
	};

	self.load(self.id);
}
