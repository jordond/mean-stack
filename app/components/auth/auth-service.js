(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name components.factory:Auth
   *
   * @description
   *
   */
  angular
    .module('components')
    .factory('Auth', Auth);

  Auth.$inject = ['$http', '$location', '$q', 'User', 'logger', '$cookieStore'];

  function Auth($http, $location, $q, User, logger, $cookieStore) {
    var currentUser = {}
      , service = {
          login          : login,
          logout         : logout,
          getSelf        : getSelf,
          getCurrentUser : getCurrentUser,
          getToken       : getToken,
          isAdmin        : isAdmin,
          isLoggedIn     : isLoggedIn,
          isLoggedInAsync: isLoggedInAsync
        };

    if ($cookieStore.get('token')) {
      currentUser = service.getSelf();
    }

    return service;

    /**
     * Public Methods
     */

    /**
     * Attempt to log the given user in
     * @param  {object} user Contains the email and password
     * @return {promise}     Take action once resolved
     */
    function login(user) {
      return $http.post('/auth/local', {
          email: user.email,
          password: user.password
        })
        .then(loginSuccess)
        .catch(loginFailed);

      function loginSuccess(response) {
        $cookieStore.put('token', response.data.token);
        currentUser = service.getSelf();
        $location.path('/');
        return response.data.token;
      }

      function loginFailed(error) {
        logger.error(error.data.message, error, 'Login failed');
        service.logout();
        return $q.reject(error.data.message);
      }
    }

    /**
     * Log the user out by removing the token
     */
    function logout() {
      $cookieStore.remove('token');
      currentUser = {};
    }

    /**
     * Grab the current logged in user
     * @return {Object} Current user
     * @return {String} Error message
     */
    function getSelf() {
      return User.me()
        .$promise
        .then(success)
        .catch(failed);

      function success(response) {
        currentUser = response;
        return response;
      }

      function failed(error) {
        logger.error(error.data.message, error);
        service.logout();
        return $q.reject(error.data.message);
      }
    }

    /**
     * Synchronous Getters
     */

    /**
     * Get the currently logged in user
     * @return {object} Logged in use
     */
    function getCurrentUser() {
      return currentUser;
    }

    function getToken() {
      return $cookieStore.get('token');
    }

    function isAdmin() {
      return currentUser.role === 'admin';
    }

    function isLoggedIn() {
      return currentUser.hasOwnProperty('role');
    }

    /**
     * Async Getters
     */

    /**
     * Creates a promise out of the currentUser object
     * preforms check once it is resolved
     * @return {Boolean} Logged in status
     */
    function isLoggedInAsync() {
      return $q.when(currentUser)
        .then(function (user) {
          if (user.hasOwnProperty('role')) {
            return true;
          }
          return false;
        });
    }
  }
}());
