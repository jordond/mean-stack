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

  function AdminCtrl() {
    var vm = this;
    vm.ctrlName = 'AdminCtrl';
  }
}());
