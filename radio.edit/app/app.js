var app = angular.module('app', [
    'ui.router', 
    'ngMaterial',
    'md.data.table'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/radios');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('radios', {
            url: '/radios',
            templateUrl: 'pages/radios/radios.html',
            controller: 'MainPageController',
            controllerAs: '_ctrl'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit       
        });
        
});