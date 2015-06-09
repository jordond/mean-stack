(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name admin.directive:usersTable
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('admin')
    .directive('usersTable', usersTable);

  usersTable.$injector = ['$state', '$stateParams', 'Auth'];

  function usersTable($state, $stateParams, Auth, SweetAlert) {
    var directive = {
      restrict: 'EA',
      scope: {
        users: '=',
        state: '@'
      },
      templateUrl: 'admin/usersTable/users-table-directive.tpl.html',
      replace: false,
      link: linkFunct,
      controller: UsersTableCtrl,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function UsersTableCtrl() {
      var vm = this
        , confirmOptions;

      // Public members
      vm.activeUser = $stateParams.userId;
      vm.currentUser = {};
      vm.edit = edit;
      vm.revoke = revoke;
      vm.deleteUser = deleteUser;

      confirmOptions = {
        title: 'Are you sure?',
        text: 'This cannot be undone',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, do it!',
        closeOnConfirm: false
      };

      Auth.getUserAsync()
        .then(function (user) {
          vm.currentUser = user._id;
        });

      function edit(id) {
        vm.activeUser = id;
        $state.go(vm.state + '.edit', {userId: id});
      }

      function revoke(user) {
        confirmOptions.text = 'Revoke ' + user.username + '\'s auth token?';

        SweetAlert.warning(confirmOptions)
          .then(function () {
            SweetAlert.success({
              title: 'Success',
              text: user.username + '\'s login token was revoked'
            });
          });
      }

      function deleteUser(user) {
        SweetAlert.warning(confirmOptions)
          .then(function () {
            console.log('success delete', user);
          });
      }
    }

    function linkFunct(scope, element, attrs) {
      /*jshint unused:false */
      /*eslint "no-unused-vars": [2, {"args": "none"}]*/
    }
  }
}());
