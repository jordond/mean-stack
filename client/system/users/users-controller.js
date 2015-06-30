(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name system.controller:UsersCtrl
   *
   * @description
   *
   */
  angular
    .module('system')
    .controller('UsersCtrl', UsersCtrl);

  UsersCtrl.$inject = ['usersPrepService'];

  function UsersCtrl(usersPrepService) {
    var vm = this;
    vm.users = usersPrepService;
  }
}());
