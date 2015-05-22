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

  function usersTable($state, $stateParams) {
    var directive = {
      restrict: 'EA',
      scope: {
        users: '='
      },
      templateUrl: 'admin/usersTable/users-table-directive.tpl.html',
      replace: false,
      link: linkFunct,
      controller: UsersTableCtrl,
      controllerAs: 'vm'
    };

    return directive;

    function UsersTableCtrl() {
      var vm = this;
      vm.activeUser = $stateParams.userId;
      vm.edit = edit;

      function edit(id) {
        vm.activeUser = id;
        $state.go('admin.edit', {userId: id});
      }
    }

    function linkFunct(scope, element, attrs) {
      /*jshint unused:false */
      /*eslint "no-unused-vars": [2, {"args": "none"}]*/
    }
  }
}());
