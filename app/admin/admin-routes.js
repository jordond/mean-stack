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
        restricted: true,
        resolve: {
          usersPrepService: usersPrepService
        }
      })
      .state('admin.new', {
        url: '/new',
        templateUrl: 'admin/newUser/new-user.tpl.html',
        controller: 'NewUserCtrl',
        controllerAs: 'vm',
        restricted: true
      });
  }

  usersPrepService.$inject = ['UserData'];
  function usersPrepService(UserData) {
    return UserData.all();
  }
}());
