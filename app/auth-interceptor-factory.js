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

  function authInterceptor($rootScope, $q, $cookieStore, $injector) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },
      responseError: function (response) {
        var $state = $injector.get('$state')
          , toastr = $injector.get('toastr')
          , errorMessage = '';
        if (response.status === 401) {
          $state.go('login');
          $cookieStore.remove('token');
        } else if (response.status === 0) {
          // implement error state if server dies
          // $state.go('error');
          console.log('server died');
        }

        errorMessage = angular.isUndefinedOrNull ?
          'Something went wrong...' : response.data.message;
        toastr.error(errorMessage, 'Error');

        return $q.reject(response);
      }
    };
  }
}());
