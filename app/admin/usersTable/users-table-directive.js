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

  usersTable.$injector = ['$state', '$stateParams', 'Auth', 'UserData', 'SweetAlert'];

  function usersTable($state, $stateParams, Auth, UserData, SweetAlert) {
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
        confirmOptions.title = 'Revoke ' + user.username + '\'s token?';
        confirmOptions.text = 'This will force them to login again';
        SweetAlert.warning(confirmOptions)
          .then(function () {
            SweetAlert.success({
              title: 'Success',
              text: user.username + '\'s login token was revoked'
            });
          });
      }

      function deleteUser(user) {
        confirmOptions.title = 'Delete ' + user.username + '?';
        confirmOptions.text = 'Are you sure? This cannot be undone!';
        SweetAlert.warning(confirmOptions)
          .then(function () {
            callDelete(user);
          });
      }

      function callDelete(user) {
        return UserData.remove(user._id)
          .then(success)
          .catch(failed);

        function success(response) {
          SweetAlert.success({
            title: 'Success',
            text: response
          });
        }

        function failed() {
          SweetAlert.error({
            title: 'Error',
            text: 'Something went wrong, user not deleted'
          });
        }
      }
    }

    function linkFunct(scope, element, attrs) {
      /*jshint unused:false */
      /*eslint "no-unused-vars": [2, {"args": "none"}]*/
    }
  }
}());
