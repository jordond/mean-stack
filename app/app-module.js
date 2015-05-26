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
      'angularMoment',
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

  function run($rootScope, $state, $location, Auth, Socket, Token, roles, logger) {
    Token.init();

    if (Token.has()) {
      Auth.getSelf()
        .then(function () {
          Token.activate();
          Socket.init();
        });
    }

    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync()
        .then(function (loggedIn) {
          var index;
          if (next.restricted && !loggedIn) {
            event.preventDefault();
            $state.go('login');
          } else if (next.role) {
            index = roles().indexOf(Auth.getCurrentRole());
            if (index < roles().indexOf(next.role)) {
              event.preventDefault();
              $state.go('dashboard');
              logger.warning('You\'re not allowed to access that page', '', 'Forbidden');
            }
          }
        });
    });
  }
}());
