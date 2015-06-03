(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name admin.user.controller:UserCtrl
   *
   * @description
   *
   */
  angular
    .module('admin')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$state', 'userPrepService'];

  function UserCtrl($state, userPrepService) {
    var vm = this
      , currentState = $state.current.name;

    vm.user = {};
    vm.title = '';
    vm.action = '';
    vm.callback = callback;

    init();

    function init() {
      if (currentState.indexOf('create') > -1) {
        vm.title = 'Create a new user!';
        vm.action = 'create';
      } else if (currentState.indexOf('edit') > -1) {
        vm.user = userPrepService;
        vm.title = 'Edit ' + vm.user.username + '\'s profile!';
        vm.action = 'update';
      }
    }

    function callback(success) {
      if (angular.equals(success, true) || angular.isUndefined(success)) {
        vm.user = {};
        $state.go('^', null, {reload: true});
      }
    }
  }
}());
