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

  function run($rootScope, $state, Auth, Socket, Token, logger) {
    var roles = [];
    Token.init()
      .then(function () {
        if (Token.has()) {
          Auth.getSelf();
          Auth.roles()
            .then(function (response) {
              roles = response;
            });
          Token.activate();
          Socket.init();
        }
      });

    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, from, fromParams) {
      Auth.isLoggedInAsync()
        .then(function (loggedIn) {
          var index;
          if (next.restricted && !loggedIn) {
            event.preventDefault();
            $state.go('login');
          }
          if (next.role) {
            index = roles.indexOf(Auth.getCurrentRole());
            if (index < roles.indexOf(next.role)) {
              event.preventDefault();
              $state.go(from, fromParams);
              logger.warning('You\'re not allowed to access that page', '', 'Forbidden');
            }
          }
        });
    });
  }
}());
