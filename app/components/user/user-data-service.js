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
    var service = {
      create        : createUser,
      roles         : getUserRoles,
      changePassword: changePassword,
      update        : update
    };

    return service;

    /**
     * Public Methods
     */

    /**
     * Create a new user
     * @param  {object} newUser User to be created
     * @return {promise}        Promise of a better tomorrow
     */
    function createUser(newUser) {
      return User.save(newUser)
        .$promise
        .then(success)
        .catch(createFailed);

      function createFailed(error) {
        failed(error, 'Failed to Create User');
      }
    }

    /**
     * Get the supported user roles
     * @return {Array} List of all the accepted roles
     */
    function getUserRoles() {
      return User.getRoles()
        .$promise
        .then(success)
        .catch(userRolesFailed);

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
      return User.changePassword({id: id}, {
          oldPassword: oldPassword,
          newPassword: newPassword
        })
        .$promise
        .then(success)
        .catch(changePasswordFailed);

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
        .then(success)
        .catch(updateFailed);

      function updateFailed(error) {
        failed(error, 'Update failed');
      }
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
      return response;
    }

    /**
     * Reusable rejection function for a failed promise
     * @param  {Object} error   The error object from the $promise
     * @param  {String} message Title for the toast notification
     * @return {String}         Error message
     */
    function failed(error, message) {
      logger.error(error.data.message, error, message);
      return $q.reject(error.data.message);
    }
  }
}());
