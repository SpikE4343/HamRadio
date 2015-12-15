var app = angular.module('app', [
    'ui.router',
    'ngMaterial',
    'md.data.table',
    'ngMdIcons'
]).config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    $urlRouterProvider.when('', '/radios');
    $urlRouterProvider.otherwise('/radios');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('radios', {
            url: '/radios',
            templateUrl: 'pages/radios/radios.html',
            controller: 'MainPageController',
            controllerAs: '_ctrl'
        })
        .state('detail', {
            url: '/detail/:id',
            templateUrl: 'pages/detail/detail.html',
            controller: 'DetailController',
            controllerAs: 'd'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit
        });


    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');

        ;

}).filter('keyboardShortcut', function($window) {
    return function(str) {
      if (!str) return;
      var keys = str.split('-');
      var isOSX = /Mac OS X/.test($window.navigator.userAgent);
      var seperator = (!isOSX || keys.length > 2) ? '+' : '';
      var abbreviations = {
        M: isOSX ? '⌘' : 'Ctrl',
        A: isOSX ? 'Option' : 'Alt',
        S: 'Shift'
      };
      return keys.map(function(key, index) {
        var last = index == keys.length - 1;
        return last ? key : abbreviations[key];
      }).join(seperator);
    };
  });
