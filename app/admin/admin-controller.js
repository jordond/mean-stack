(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name admin.controller:AdminCtrl
   *
   * @description
   *
   */
  angular
    .module('admin')
    .controller('AdminCtrl', AdminCtrl);

  AdminCtrl.$inject = ['UserSocket'];

  function AdminCtrl(UserSocket) {
    var vm = this;

    vm.users = [];

    UserSocket.activate()
      .then(function (users) {
        vm.users = users;
      });
  }
}());
