var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services']);

app.value('API', 'http://spcultura.prefeitura.sp.gov.br/api');
app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $stateProvider

        // setup an abstract state for the tabs directive
        .state('map', {
            url: "/map",
            controller: 'MapCtrl',
            templateUrl: "templates/tab-map.html"
        })

    /*.state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
      })*/

    // Each tab has its own nav history stack:

    /*.state('tab.map', {
      url: '/map',
      views: {
      'tab-map': {
      templateUrl: 'templates/tab-map.html',
      controller: 'MapCtrl'
      }
      }
      })*/

    .state('events', {
        url: '/events',
        templateUrl: 'templates/tab-events.html',
        controller: 'EventsCtrl'
    });

    /*.state('tab.account', {
      url: '/account',
      views: {
      'tab-account': {
      templateUrl: 'templates/tab-account.html',
      controller: 'AccountCtrl'
      }
      }
      });*/

    // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/tab/map');
    $urlRouterProvider.otherwise('/map');

});
