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

  Token.$inject = ['$cookieStore', '$q', '$interval', '$timeout', '$http', 'logger', 'Socket'];

  function Token($cookieStore, $q, $interval, $timeout, $http, logger, Socket) {
    var TAG = 'Token'
      , self = this
      , activeToken
      , refresher;

    /**
     * Public Members
     */

    self.init       = init;
    self.get        = get;
    self.valid      = valid;
    self.has        = has;
    self.refresh    = refresh;
    self.store      = store;
    self.remove     = remove;
    self.activate   = activate;
    self.deactivate = deactivate;
    self.destroy    = destroy;

    /**
     * Public Methods
     */

    /**
     * @public init
     * Initialize this token service, grab the current token
     * and then activate $interval timer
     * @return {Promise} Containing the active token
     */
    function init() {
      activeToken = $cookieStore.get('token');
      if (!angular.isString(activeToken)) {
        activeToken = undefined;
      }
      return $q.when(activeToken);
    }

    /**
     * @public get
     * Accessor for the token
     * @return {String} User's JWT
     */
    function get() {
      return activeToken;
    }

    /**
     * Check with the server to see if token is valid
     * @return {Promise} status of call
     */
    function valid() {
      var promise = $q.defer();

      if (has()) {
        promise = $http.get('/auth/valid')
          .then(function () {
            return true;
          })
          .catch(function () {
            remove();
            logger.warning('User session was invalid, login again', '', 'Try again');
          });
      } else {
        promise = $q.reject();
      }

      return promise;
    }

    /**
     * @public has
     * Check to see whether or not the token exists
     * @return {Boolean} Existence of token
     */
    function has() {
      if (angular.isUndefined(activeToken) || activeToken === '') {
        return false;
      }
      return true;
    }

    /**
     * @public refresh
     * Manually refresh the token
     * @return {Promise} Contains status of token refresh
     */
    function refresh() {
      return $q.when(refreshToken());
    }

    /**
     * @public store
     * Place the token into cookie storage
     * @param  {String} token User JWT
     */
    function store(token) {
      activeToken = token;
      $cookieStore.put('token', token);
    }

    /**
     * @public remove
     * Remove the token from the cookie storage
     */
    function remove() {
      activeToken = undefined;
      $cookieStore.remove('token');
    }

    /**
     * @public activate
     * Activate the $interval timer to periodically check if the
     * token needs to be refreshed.
     * @param {Boolean} refreshNow whether or not to refresh right away
     * @param {int} delay Interval delay default 1 hour
     */
    function activate(refreshNow, delay) {
      delay = angular.isDefined(delay) ? delay : (1 * 60 * 60 * 1000);
      if (angular.isDefined(refresher)) {
        return;
      }

      logger.log(TAG, 'Starting token refresher');
      refresher = $interval(refreshToken, delay);

      if (refreshNow) {
        $timeout(refreshToken, 1000 * 60);
      }
    }

    /**
     * @public deactivate
     * Deactivate the $interval timer
     */
    function deactivate() {
      if (angular.isDefined(refresher)) {
        logger.log(TAG, 'Stopping token refresher');
        $interval.cancel(refresher);
        refresher = undefined;
      }
    }

    /**
     * @public destroy
     * Delete the token from storage and stop the timer, effectively
     * logging the user out
     */
    function destroy() {
      remove();
      deactivate();
    }

    /**
     * Private Methods
     */

    /**
     * @private refreshToken
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
        store(response.data.token);
        Socket.reset();
        logger.log(TAG, 'Token was refreshed.');
        return response.data.token;
      }

      function refreshFailed(error) {
        deactivate();
        return $q.reject(error.data.message);
      }
    }
  }
}());
