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
      .state('admin.new', {
        url: '/new',
        templateUrl: 'admin/user/user.tpl.html',
        controller: 'NewUserCtrl',
        controllerAs: 'vm',
        role: 'admin'
      })
      .state('admin.edit', {
        url: '/edit/:userId',
        templateUrl: 'admin/user/user.tpl.html',
        controller: 'EditUserCtrl',
        controllerAs: 'vm',
        role: 'admin',
        resolve: {
          editUserPrepService: editUserPrepService
        }
      });
  }

  usersPrepService.$inject = ['UserSocket'];
  function usersPrepService(UserSocket) {
    return UserSocket.activate();
  }

  editUserPrepService.$inject = ['$stateParams', 'UserData'];
  function editUserPrepService($stateParams, UserData) {
    var id = $stateParams.userId;
    return UserData.find(id);
  }
}());
