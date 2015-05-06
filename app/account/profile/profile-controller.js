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

  function ProfileCtrl(_, Auth, UserService) {
    var vm = this;

    vm.user = Auth.getCurrentUser();
    vm.userCopy = angular.copy(vm.user);

    function submit(form) {
      return updateUser(vm.user).then(function () {
        vm.userCopy = angular.copy(vm.user);
        form.$setPristine();
      });
    }

    function updateUser(user) {
      return UserService.update(user)
        .then(function (data) {
          return data;
        });
    }

    function reset(form) {
      vm.user = angular.copy(vm.userCopy);
      form.$setPristine();
    }

    vm.submit = submit;
    vm.reset = reset;
  }
}());
