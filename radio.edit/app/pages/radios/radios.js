angular.module('app')
       .controller('RadiosController', ['radioService', '$mdDialog', '$mdSidenav', 'radioToolbar', RadiosController]);

function RadiosController(radioService, $mdDialog, $mdSidenav, radioToolbar) {
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

  self.radios = null;

  radioService.list().then( function(list){
    self.radios = list;
  }, function(err){
    self.error = err;
  });

  self.isNavDrawerOpen = function() {
    return $mdSidenav('nav').isOpen() ||
           $mdSidenav('nav').isLockedOpen();
  };

  self.isLockedOpen = function() {
    return $mdSidenav('nav').isLockedOpen();
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
