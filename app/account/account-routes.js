(function () {
  'use strict';

  angular
    .module('account')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'account/login/login.tpl.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'account/settings/login.tpl.html',
        controller: 'SettingsCtrl',
        controllerAs: 'vm'
      });
  }
}());
