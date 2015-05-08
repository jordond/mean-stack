(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name components.service:token
   *
   * @description
   *
   */
  angular
    .module('components')
    .service('Token', Token);

  Token.$inject = ['$cookieStore', '$q', '$interval', '$http', 'logger'];

  function Token($cookieStore, $q, $interval, $http, logger) {
    var self = this
      , activeToken;

    /**
     * Public Methods
     */

    self.init = function () {
      activeToken = $cookieStore.get('token');
      return $q.when(activeToken);
    };

    self.get = function () {
      return activeToken;
    };

    self.has = function () {
      if (angular.isUndefined(activeToken) || activeToken === '') {
        return false;
      }
      return true;
    };

    self.refresh = function () {
      return $q.when(refreshToken());
    };

    self.store = function (token) {
      activeToken = token;
      $cookieStore.put('token', token);
    };

    self.remove = function () {
      activeToken = undefined;
      $cookieStore.remove('token');
    };

    self.activate = function () {

    };

    self.deactivate = function () {

    };

    /**
     * Private Methods
     */

    /**
     * Will send a request to server to refresh token, the server
     * either responds with a new token, or the same one.  Either way
     * put that token into storage
     * @return {String} New or old token
     */
    function refreshToken() {
      return $http.get('auth/refresh')
        .then(refreshSuccess)
        .catch(refreshFailed);

      function refreshSuccess(response) {
        self.store(response.data.token);
        return response.data.token;
      }

      function refreshFailed(error) {
        logger.error(error.data.message, error, 'Refreshing token failed');
        return $q.reject(error.data.message);
      }
    }
  }
}());
