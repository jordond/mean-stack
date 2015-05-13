(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:passwordChange
   * @restrict EA
   * @element
   *
   * @description
   *
   *
   */
  angular
    .module('components')
    .directive('passwordChange', passwordChange);

  function passwordChange() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'components/user/password/password-change-directive.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: function () {
        var vm = this;

        function submit() {
          console.log('submit');
        }

        vm.submit = submit;
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    };
  }
}());
