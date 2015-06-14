(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name account.controller:SettingsCtrl
   *
   * @description
   *
   */
  angular
    .module('account')
    .controller('SettingsCtrl', SettingsCtrl);

  function SettingsCtrl() {
    var vm = this;
    vm.name = 'SettingsCtrl';
  }
}());
