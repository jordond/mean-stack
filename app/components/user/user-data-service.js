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

  UserData.$inject = ['User'];

  function UserData(User) {
    var service = {
      createUser    : createUser,
      changePassword: changePassword,
      update        : update
    };

    return service;

    /**
     * Create a new user
     * @param  {object} newUser User to be created
     * @return {promise}        Promise of a better tomorrow
     */
    function createUser(newUser) {
      return User.save(newUser)
        .$promise
        .then(createComplete)
        .catch(createFailed);

      function createComplete(response) {
        return response.data;
      }

      function createFailed(error) {
        console.log(error);
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
        .then(changePasswordComplete)
        .catch(changePasswordFailed);

      function changePasswordComplete(response) {
        return response.data;
      }

      function changePasswordFailed(error) {
        console.log(error);
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
        .then(updateComplete)
        .catch(updateFailed);

      function updateComplete(response) {
        return response.data;
      }

      function updateFailed(error) {
        console.log(error);
      }
    }
  }
}());
