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

  Auth.$inject = ['$http', 'User', '$cookieStore'];

  function Auth($http, User, $cookieStore) {
    var currentUser = {}
      , service = {
      login          : login,
      logout         : logout,
      getCurrentUser : getCurrentUser,
      getToken       : getToken,
      isAdmin        : isAdmin,
      isLoggedIn     : isLoggedIn,
      isLoggedInAsync: isLoggedInAsync
    };

    if ($cookieStore.get('token')) {
      currentUser = User.me();
    }

    return service;

    /**
     * Attempt to log the given user in
     * @param  {object} user Contains the email and password
     * @return {promise}      Take action once resolved
     */
    function login(user) {
      return $http.post('/auth/local', {
          email   : user.email,
          password: user.password
        })
        .then(loginSuccess)
        .catch(loginFailed);

      function loginSuccess(response) {
        $cookieStore.put('token', response.token);
        // possibly change
        currentUser = User.me();
      }

      function loginFailed(error) {
        // replace with actual logger
        console.error('login failed' + error);
        service.logout();
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
     * Get the currently logged in user
     * @return {object} Logged in use
     */
    function getCurrentUser() {
      // possibly change to new way
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

    function isLoggedInAsync(callback) {
      if (currentUser.hasOwnProperty('$promise')) {
        currentUser
          .$promise
          .then(loggedInTrue)
          .catch(loggedInFalse);
      } else if (currentUser.hasOwnProperty('role')) {
        callback(true);
      } else {
        callback(false);
      }

      function loggedInTrue() {
        return true;
      }

      function loggedInFalse() {
        return false;
      }
    }
  }
}());
