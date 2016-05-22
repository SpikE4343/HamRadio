angular.module('app')
       .controller('RadiosController', ['$mdDialog', '$mdSidenav', 'radioToolbar', RadiosController]);

function RadiosController($mdDialog, $mdSidenav, radioToolbar) {
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

  self.isNavDrawerOpen = function() {
    return $mdSidenav('nav').isOpen() ||
           $mdSidenav('nav').isLockedOpen();
  };

  self.toggleNavDrawer = function() {
    $mdSidenav('nav').toggle();
  };

  self.closeNavDrawer = function() {
    $mdSidenav('nav').close();
  }

  self.navs = function() {
    return radioToolbar.navs;
  }
}
