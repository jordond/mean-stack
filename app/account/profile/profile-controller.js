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

  function ProfileCtrl(Auth) {
    var vm = this;
    vm.user = Auth.getCurrentUser();
  }
}());
