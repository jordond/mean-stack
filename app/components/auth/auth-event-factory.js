(function () {
  'use strict';

  /**
   * @ngdoc factory
   * @name components.service:AuthEvent
   *
   * @description
   *
   */
  angular
    .module('components')
    .factory('AuthEvent', AuthEventConfig);

  AuthEventConfig.$injector = ['$rootScope'];

  function AuthEventConfig($rootScope) {
    var service = {
      authenticated  : authenticated,
      refresh        : refresh,
      deauthenticated: deauthenticated,
      onAuth         : onAuth,
      onRefresh      : onRefresh,
      onDeauth       : onDeauth
    };

    return service;

    /**
     * Public Methods
     */

    function authenticated(args) {
      $rootScope.$broadcast('auth:authenticated', args);
    }

    function refresh(args) {
      $rootScope.$broadcast('auth:refresh', args);
    }

    function deauthenticated(args) {
      $rootScope.$broadcast('auth:deauthenticated', args);
    }

    function onAuth(callback) {
      $rootScope.$on('auth:authenticated', callback);
    }

    function onRefresh(callback) {
      $rootScope.$on('auth:refresh', callback);
    }

    function onDeauth(callback) {
      $rootScope.$on('auth:deauthenticated', callback);
    }
  }
}());
