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
      'account',
      'admin'
    ]);

  angular
    .module('app')
    .config(config)
    .run(run);

  function config($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }

  function run($rootScope, $state, Auth, Token, JsonService) {
    Token.init()
      .then(function () {
        if (Token.has()) {
          Auth.getSelf();
          Token.activate();
        }
      });

    JsonService.get();

    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync()
        .then(function (loggedIn) {
          if (next.restricted && !loggedIn) {
            event.preventDefault();
            $state.go('login');
          }
        });
      $rootScope.$broadcast('stateChanged', next.name);
    });
  }
}());
