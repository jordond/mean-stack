(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:logout
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('logout', logout);

  function logout() {
    return {
      restrict: 'EA',
      scope: {},
      template: '<i class="fa fa-power-off" ng-click="vm.logout()"></>',
      replace: false,
      controllerAs: 'vm',
      controller: function ($location, Auth) {
        var vm = this;

        function logout() {
          Auth.logout();
          $location.path('/login');
        }

        vm.logout = logout;
      }
    };
  }
}());
