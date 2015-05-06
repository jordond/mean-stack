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

        if ($scope.user) {
          $scope.user = $scope.user;
        }

        vm.token = Auth.getToken();
        vm.roles = Auth.getRoles();
        vm.isAdmin = Auth.isAdmin();

        function showToken() {
          toastr.info(vm.token, 'Your Full Token', {
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
