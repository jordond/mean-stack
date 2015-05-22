(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name admin.edit.controller:EditUserCtrl
   *
   * @description
   *
   */
  angular
    .module('admin')
    .controller('EditUserCtrl', EditUserCtrl);

  function EditUserCtrl($state, editUserPrepService, UserData) {
    var vm = this;
    vm.user = editUserPrepService;

    if (vm.user) {
      init();
    } else {
      $state.go('admin');
    }

    function init() {
      vm.isExisting = true;
      vm.title = 'Edit ' + vm.user.username + '\'s profile!';
    }

    /**
     * Submit the form in an attempt to create a new user.
     * If creation was a success then clear and reset the form
     * @param  {Object} form Form controller
     * @return {Promise}     Status of the call
     */
    function submit(form) {
      return updateUser(vm.user)
        .then(function (success) {
          if (success) {
            form.$setPristine();
            $state.go('admin');
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
      vm.user = {};
      form.$setPristine();
      $state.go('admin');
    }

    vm.submit = submit;
    vm.reset = reset;
  }
}());
