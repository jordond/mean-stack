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

  function ProfileCtrl($state, _, Auth, UserData) {
    var vm = this;
    vm.user = {};
    vm.copy = {};

    activate();

    function activate() {
      return Auth.getCurrentUser()
        .then(function (user) {
          vm.user = user;
          vm.copy = angular.copy(user);
        });
    }

    function submit() {
      return updateUser(vm.user)
        .then(function () {
          Auth.getSelf()
            .then(function () {
              $state.reload();
            });
        });
    }

    function updateUser(user) {
      return UserData.update(user);
    }

    function reset(form) {
      vm.user = angular.copy(vm.copy);
      form.$setPristine();
    }

    vm.submit = submit;
    vm.reset = reset;
  }
}());
