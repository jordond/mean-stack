(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name app.factory:authInterceptor
   *
   * @description
   *
   */
  angular
    .module('app')
    .factory('authInterceptor', authInterceptor);

  function authInterceptor($rootScope, $q, $injector) {
    var $state = {}
      , Token = {}
      , service = {
          request: request,
          responseError: responseError
        };

    return service;

    function request(config) {
      Token = $injector.get('Token');
      config.headers = config.headers || {};
      if (Token.has()) {
        config.headers.Authorization = 'Bearer ' + Token.get();
      }
      return config;
    }

    function responseError(response) {
      Token = $injector.get('Token');
      $state = $injector.get('$state');
      if (response.status === 401) {
        $state.go('login');
        Token.remove();
      } else if (response.status === 0) {
        // implement error state if server dies
        // $state.go('error');
        console.log('server died');
      }
      return $q.reject(response);
    }
  }
}());
