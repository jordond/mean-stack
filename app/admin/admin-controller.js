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

  AdminCtrl.$inject = ['usersPrepService'];

  function AdminCtrl(usersPrepService) {
    var vm = this;
    vm.ctrlName = 'AdminCtrl';
    vm.test = usersPrepService;
  }
}());
