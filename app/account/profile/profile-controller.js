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

  function ProfileCtrl(_, Auth) {
    var vm = this;

    vm.user = Auth.getCurrentUser();
    vm.userCopy = angular.copy(vm.user);

    function submit(form) {
      console.log('submit');
      form.$setPristine();
    }

    function reset(form) {
      vm.userCopy.token = vm.user.token;
      vm.user = angular.copy(vm.userCopy);
      form.$setPristine();
    }

    vm.submit = submit;
    vm.reset = reset;
  }
}());
