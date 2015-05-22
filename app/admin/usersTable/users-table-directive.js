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

  function usersTable() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'admin/usersTable/users-table-directive.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: function () {
        var vm = this;
        vm.name = 'usersTable';
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    };
  }
}());
