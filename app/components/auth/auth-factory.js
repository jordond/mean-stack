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

  Auth.$inject = ['$http', '$location', '$q', '$state', 'User', 'Socket', 'Token', 'logger'];

  function Auth($http, $location, $q, $state, User, Socket, Token, logger) {
    var currentUser = {}
      , service = {
          login          : login,
          logout         : logout,
          getSelf        : getSelf,
          getCurrentUser : getCurrentUser,
          getToken       : getToken,
          setUser        : setCurrentUser,
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
        Socket.init();
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
      Token.destroy();
      Socket.destroy();
      currentUser = {};
      $state.go('login');
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
        currentUser = response.data;
        return response.data;
      }

      function failed(error) {
        logger.error(error.data, error);
        return $q.reject(error.data.message);
      }
    }

    /**
     * Synchronous Getters
     */

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
     * Synchronous Setters
     */

    /**
     * Update the current user
     * @param {Object} user new user object
     */
    function setCurrentUser(user) {
      currentUser = user;
    }

    /**
     * Async Getters
     */

    /**
     * Get the currently logged in user
     * @return {object} Logged in user
     */
    function getCurrentUser() {
      return $q.when(currentUser);
    }

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
