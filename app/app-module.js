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
      'ngMessages',
      'ngSanitize',
      'ngAnimate',
      'mgcrea.ngStrap',
      'toastr',
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

  function run($rootScope, $state, Auth, JsonService) {
    JsonService.get();

    $rootScope.$on('$stateChangeStart', function (event, next) {
      $rootScope.$broadcast('stateChanged', next.name);

      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.restricted && !loggedIn) {
          event.preventDefault();
          $state.go('login');
        }
      });
    });
  }
}());
