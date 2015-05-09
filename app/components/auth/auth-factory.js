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

  Auth.$inject = ['$http', '$location', '$q', 'User', 'Token', 'logger'];

  function Auth($http, $location, $q, User, Token, logger) {
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
        Token.store(response.data.token);
        Token.activate();
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
      Token.remove();
      Token.deactivate();
      currentUser = {};
    }

    /**
     * Grab the current logged in user
     * @return {Object} Current user
     * @return {String} Error message
     */
    function getSelf() {
      currentUser = User.me()
        .$promise
        .then(success)
        .catch(failed);

      return currentUser;

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
      return Token.get();
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
