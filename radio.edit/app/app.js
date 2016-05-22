var app = angular.module('app', [
    'ui.router',
    'ngMaterial',
    'md.data.table',
    'ngMdIcons'
]).config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    $urlRouterProvider.when("", "/radios/list");
    $urlRouterProvider.when("/", "/radios/list");

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/radios/list");

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('radios', {
            abstract: true,
            url: '/radios',
            templateUrl: 'pages/radios/radios.html',
            controller: 'RadiosController',
            controllerAs: 'c',
            onEnter: ['radioToolbar', function( radioToolbar ){
              radioToolbar.push( 'Radios' );
            }],
            onExit: ['radioToolbar', function( radioToolbar ){
              radioToolbar.pop();
            }],
        })
        .state('radios.list', {
            url: '/list',
            templateUrl: 'pages/radios/list.html',
            controller: 'MainPageController',
            controllerAs: '_ctrl',
            onEnter: ['radioToolbar', function( radioToolbar ){
              radioToolbar.push( 'All' );
            }],
            onExit: ['radioToolbar', function( radioToolbar ){
              radioToolbar.pop();
            }],
        })
        .state('radios.detail', {
            url: '/:id',
            templateUrl: 'pages/radios/detail.html',
            controller: 'DetailController',
            controllerAs: 'd',
            onEnter: ['radioService', 'radioToolbar', '$stateParams', function( radioService, radioToolbar, $stateParams ){
               var radio = radioService.radioInfo($stateParams.id);
               if( radio ) {
                 radioToolbar.push( radio.name.toUpperCase() );
               }
            }],
            onExit: ['radioToolbar', function( radioToolbar ){
               radioToolbar.pop();
            }],
        })


        ;


    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        //.accentPalette('orange')
        //.primaryPalette('orange')
        //.dark()
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
