angular.module('app')
       .controller('MainPageController', ['radioService', '$q', '$mdDialog', MainPageController]);

function MainPageController(radioService, $q, $mdDialog) {
	var self = this;
	self.radios = [];
}
