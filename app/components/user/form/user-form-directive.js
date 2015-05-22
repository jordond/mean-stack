(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:userForm
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('userForm', userForm);

  function userForm() {
    return {
      restrict: 'EA',
      scope: {
        user: '=',
        form: '=',
        existingUser: '@'
      },
      templateUrl: 'components/user/form/user-form-directive.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: function ($scope, Auth, UserData, toastr) {
        var vm = this
          , role;
        vm.token = '';
        vm.roles = [];
        vm.isAdmin = false;

        activate();

        function activate() {
          vm.token = Auth.getToken();
          vm.isAdmin = Auth.isAdmin();

          if ($scope.user.hasOwnProperty('role')) {
            role = $scope.user.role;
            $scope.user.role = '';
          }

          UserData.roles()
            .then(function (roles) {
              vm.roles = roles;
              if ($scope.user.hasOwnProperty('role')) {
                $scope.user.role = role;
              }
            });
        }

        function showToken() {
          toastr.info(vm.token, 'Your Full Token', {
            closeButton: true,
            maxOpened: 1,
            tapToDismiss: false,
            timeout: 7000
          });
        }

        vm.showToken = showToken;
      }
    };
  }
}());
