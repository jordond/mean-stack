(function () {
  'use strict';

  angular
    .module('admin')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'admin/admin.tpl.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      });
  }
}());
