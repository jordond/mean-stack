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
        controllerAs: 'vm',
        restricted: true
      })
      .state('admin.new', {
        url: '/admin/new',
        templateUrl: 'admin/newUser/new-user.tpl.html',
        controller: 'NewUserCtrl',
        controllerAs: 'vm',
        restricted: true
      });
      // .state('admin.edit', {
      //   url: '/admin/edit',
      //   templateUrl: 'admin/newUser/new-user.tpl.html',
      //   controller: 'NewUserCtrl',
      //   controllerAs: 'vm',
      //   restricted: true
      // });
  }
}());
