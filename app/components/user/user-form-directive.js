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
        user: '='
      },
      templateUrl: 'components/user/user-form-directive.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: function ($scope, Auth, toastr) {
        var vm = this;

        vm.user = {};
        if ($scope.user === 'me') {
          vm.user = angular.copy(Auth.getCurrentUser());
        } else if (angular.isUndefinedOrNull !== $scope.user) {
          vm.user = $scope.user;
        }
        vm.user.token = Auth.getToken();
        vm.user.roles = Auth.getRoles();

        function showToken() {
          toastr.success(vm.user.token, 'Your Token', {
            closeButton: true,
            maxOpened: 1,
            tapToDismiss: false,
            timeout: 7000
          });
        }

        vm.showToken = showToken;
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    };
  }
}());
