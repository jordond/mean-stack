angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('error', {
        url: '/error',
        template: '<h1>Server error...</h1>',
        controller: 'ErrorCtrl'
      });
  });