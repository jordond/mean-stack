(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name account.controller:ProfileCtrl
   *
   * @description
   *
   */
  angular
    .module('account')
    .controller('ProfileCtrl', ProfileCtrl);

  function ProfileCtrl($state, Auth, UserData) {
    var vm = this;
    vm.user = {};
    vm.copy = {};

    activate();

    /**
     * Initialize the controller, grab the current user and
     * make a copy of it
     * @return {Promise} Contains status of activation (optional)
     */
    function activate() {
      return Auth.getCurrentUser()
        .then(function (user) {
          vm.user = angular.copy(user);
          vm.copy = angular.copy(user);
        });
    }

    /**
     * Submit the form in an attempt to update the user
     * Call updateUser and wait for response, if update was
     * successful then get/set the updated user and reload the state
     * @param  {Object} form User profile information
     * @return {Promise}     Status (optional)
     */
    function submit(form) {
      return updateUser(vm.user)
        .then(function (updated) {
          if (updated) {
            Auth.getSelf()
              .then(function (success) {
                if (success) {
                  $state.reload();
                }
              });
          } else {
            form.$invalid = true;
          }
        });
    }

    /**
     * Call the User Data service, and attempt to update the
     * user with the new values.
     * @param  {Object} user Updated user information
     * @return {Promise}     handle success or failure
     * @return {Boolean}     If update fails return false
     */
    function updateUser(user) {
      return UserData.update(user)
        .catch(function () {
          return false;
        });
    }

    /**
     * Reset the form to its initial state
     * @param  {Object} form Form Controller
     */
    function reset(form) {
      vm.user = angular.copy(vm.copy);
      form.$setPristine();
    }

    vm.submit = submit;
    vm.reset = reset;
  }
}());
