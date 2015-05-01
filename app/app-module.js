(function () {
  'use strict';

  /* @ngdoc object
   * @name app
   * @description
   *
   */
  angular
    .module('app', [
      'ui.router',
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'mgcrea.ngStrap',
      'components',
      'dashboard',
      'account'
    ]);

  angular
    .module('app')
    .config(config)
    .run(run);

  function config($httpProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  }

  function run($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.restricted && !loggedIn) {
          $state.go('login');
        }
      });
    });
  }
}());
