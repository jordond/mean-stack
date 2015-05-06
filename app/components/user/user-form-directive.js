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
      controller: function (Auth) {
        var vm = this;

        vm.user = angular.copy(Auth.getCurrentUser());

        Auth.getRoles()
        .then(function (roles) {
          vm.roles = roles;
        });
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    };
  }
}());
