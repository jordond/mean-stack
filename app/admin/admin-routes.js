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
        role: 'admin',
        resolve: {
          usersPrepService: usersPrepService
        }
      })
      .state('admin.create', {
        url: '/create',
        templateUrl: 'admin/user/user.tpl.html',
        controller: 'UserCtrl',
        controllerAs: 'vm',
        role: 'admin',
        resolve: {
          userPrepService: userPrepService
        }
      })
      .state('admin.edit', {
        url: '/edit/:userId',
        templateUrl: 'admin/user/user.tpl.html',
        controller: 'UserCtrl',
        controllerAs: 'vm',
        role: 'admin',
        resolve: {
          userPrepService: userPrepService
        }
      });
  }

  usersPrepService.$inject = ['UserSocket'];
  function usersPrepService(UserSocket) {
    return UserSocket.activate();
  }

  userPrepService.$inject = ['$stateParams', 'UserData'];
  function userPrepService($stateParams, UserData) {
    var id = $stateParams.userId;
    if (!id) {
      return undefined;
    }
    return UserData.find(id);
  }
}());
