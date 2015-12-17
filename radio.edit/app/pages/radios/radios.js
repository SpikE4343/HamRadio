angular.module('app')
       .controller('RadiosController', ['$mdDialog', RadiosController]);

function RadiosController($mdDialog) {
	var self = this;
  self.pages = [
      {
        name: 'Radios',
        icon: 'home',
        state: 'radios.list'
      },

      {
        name: 'Memory Maps',
        icon: 'memory',
        state: 'mmap.list'
      }
  ];
}
