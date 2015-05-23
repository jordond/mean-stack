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
    var TAG = 'Token'
      , self = this
      , activeToken
      , refresher;

    /**
     * Public Methods
     */

    /**
     * Initialize this token service, grab the current token
     * and then activate $interval timer
     * @return {Promise} Containing the active token
     */
    self.init = function () {
      activeToken = $cookieStore.get('token');
      return $q.when(activeToken);
    };

    /**
     * Accessor for the token
     * @return {String} User's JWT
     */
    self.get = function () {
      return activeToken;
    };

    /**
     * Check to see whether or not the token exists
     * @return {Boolean} Existence of token
     */
    self.has = function () {
      if (angular.isUndefined(activeToken) || activeToken === '') {
        return false;
      }
      return true;
    };

    /**
     * Manually refresh the token
     * @return {Promise} Contains status of token refresh
     */
    self.refresh = function () {
      return $q.when(refreshToken());
    };

    /**
     * Place the token into cookie storage
     * @param  {String} token User JWT
     */
    self.store = function (token) {
      activeToken = token;
      $cookieStore.put('token', token);
    };

    /**
     * Remove the token from the cookie storage
     */
    self.remove = function () {
      activeToken = undefined;
      $cookieStore.remove('token');
    };

    /**
     * Activate the $interval timer to periodically check if the
     * token needs to be refreshed.
     * @param {int} delay Interval delay default 1 hour
     */
    self.activate = function (delay) {
      delay = angular.isDefined(delay) ? delay : (1 * 60 * 60 * 1000);
      if (angular.isDefined(refresher)) {
        return;
      }

      logger.log(TAG, 'Starting token refresher');
      refresher = $interval(runner, delay);
      refreshToken();

      function runner() {
        logger.log(TAG, 'Refreshing token');
        refreshToken();
      }
    };

    /**
     * Deactivate the $interval timer
     */
    self.deactivate = function () {
      if (angular.isDefined(refresher)) {
        logger.log(TAG, 'Stoping token refresher');
        $interval.cancel(refresher);
        refresher = undefined;
      }
    };

    self.destroy = function () {
      self.remove();
      self.deactivate();
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
        self.deactivate();
        return $q.reject(error.data.message);
      }
    }
  }
}());
