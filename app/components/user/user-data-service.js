(function () {
  'use strict';

  /**
   * @ngdoc factory
   * @name home.service:UserData
   *
   * @description
   *
   */
  angular
    .module('components')
    .factory('UserData', UserData);

  UserData.$inject = ['$q', 'User', 'logger'];

  function UserData($q, User, logger) {
    var roles = []
      , users
      , service = {
          all           : queryAllUsers,
          find          : findUser,
          create        : createUser,
          changePassword: changePassword,
          update        : update,
          roles         : getUserRoles,
          users         : getUsers
        };

    return service;

    /**
     * Public Methods
     */

    function queryAllUsers() {
      users = User.all()
        .$promise
        .then(getAllSuccess)
        .catch(getAllFailed);

      return users;

      function getAllSuccess(response) {
        users = response.data;
        return response.data;
      }

      function getAllFailed(error) {
        failed(error, 'Unable to fetch users');
      }
    }

    /**
     * Grab a single user from the database
     * @param  {String} id primary key for user
     * @return {Object}    Found user
     */
    function findUser(id) {
      return User.get({id: id})
        .$promise
        .then(findSuccess)
        .catch(findFailed);

      function findSuccess(response) {
        return response.data;
      }

      function findFailed(error) {
        failed(error, 'Invalid user');
      }
    }

    /**
     * Create a new user
     * @param  {object} newUser User to be created
     * @return {promise}        Promise of a better tomorrow
     */
    function createUser(newUser) {
      return User.save(newUser)
        .$promise
        .then(createSuccess)
        .catch(createFailed);

      function createSuccess(response) {
        users.push(response.data);
        success(response);
      }

      function createFailed(error) {
        failed(error, 'Failed to Create User');
      }
    }

    /**
     * Get the supported user roles
     * @return {Array} List of all the accepted roles
     */
    function getUserRoles() {
      if (roles.length > 0) {
        return $q.when(roles);
      }
      return User.getRoles()
        .$promise
        .then(userRolesSuccess)
        .catch(userRolesFailed);

      function userRolesSuccess(response) {
        roles = response.data;
        return roles;
      }

      function userRolesFailed(error) {
        failed(error, 'Couldn\'t get roles');
      }
    }

    /**
     * Change the password of the given user
     * @param  {string} id          ID of the user to be updated
     * @param  {string} oldPassword Current password
     * @param  {string} newPassword Password to change to
     * @return {promise}            Success or failure
     */
    function changePassword(id, oldPassword, newPassword) {
      if (angular.equals(oldPassword, newPassword)) {
        logger.info('Passwords were the same!', '', 'Update Failed');
        return $q.when(false);
      }

      return User.changePassword({id: id}, {
          oldPassword: oldPassword,
          newPassword: newPassword
        })
        .$promise
        .then(changePasswordSuccess)
        .catch(changePasswordFailed);

      function changePasswordSuccess(response) {
        logger.success(response.message);
        return response;
      }

      function changePasswordFailed(error) {
        failed(error, 'Couldn\' change password');
      }
    }

    /**
     * Update the user
     * @param  {object} user User object with new user information
     * @return {promise}     Success or failure
     */
    function update(user) {
      return User.update({id: user._id}, user)
        .$promise
        .then(updateSuccess)
        .catch(updateFailed);

      function updateSuccess(response) {
        service.queryAllUsers();
        logger.success(response.message, '', 'Update Succesful');
        return response.data;
      }

      /**
       * Iterate through all of the error properties and
       * create a warning toast about it
       * @param  {Object} error Error object returned from server
       * @return {Object}       Rejected promise containing error data
       */
      function updateFailed(error) {
        var errors = error.data.errors
          , err;
        for (err in errors) {
          if ({}.hasOwnProperty.call(errors, err)) {
            err = errors[err];
            logger.warning(err.message, err, error.message);
          }
        }
        return $q.reject(error.data);
      }
    }

    /**
     * Asynchronous Getters
     */

    /**
     * Get all of the uses
     * @return {Array} all users
     */
    function getUsers() {
      return $q.when(users);
    }

    /**
     * Private Response functions
     */

    /**
     * Reusable success function for a successful Promise
     * @param  {Object} response Response from the server
     * @return {Object}          Response data
     */
    function success(response) {
      logger.success(response.message);
      return response.data;
    }

    /**
     * Reusable rejection function for a failed promise
     * @param  {Object} error   The error object from the $promise
     * @param  {String} message Title for the toast notification
     * @return {String}         Error message
     */
    function failed(error, message) {
      var errMsg = error.hasOwnProperty('data') ? error.data.message : '';
      logger.error(errMsg, error, message);
      return $q.reject(false);
    }
  }
}());
