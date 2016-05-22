angular.module('app')
       .controller('MainPageController', ['radioService', '$q', '$mdDialog', MainPageController]);

function MainPageController(radioService, $q, $mdDialog) {
	var self = this;
  self.error = null;
  self.radios = null;

  radioService.list().then( function(list){
    self.radios = list;
  }, function(err){
    self.error = err;
  });
}
