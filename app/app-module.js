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

  function config($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }

  function run($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.restricted && !loggedIn && false) {
          event.preventDefault();
          $state.go('login');
        }
      });
    });
  }
}());
