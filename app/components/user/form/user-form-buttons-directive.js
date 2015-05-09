(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:userFormButtons
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('userFormButtons', userFormButtons);

  function userFormButtons() {
    return {
      restrict: 'EA',
      scope: {
        form: '=',
        action: '@',
        submit: '=',
        cancel: '='
      },
      templateUrl: 'components/user/form/user-form-buttons-directive.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: function () {
        var vm = this;
        vm.name = 'test';
      },
      compile: function (element, attrs) {
        if (!attrs.action) {
          attrs.action = 'save';
          console.error('No action provided, defaulting to "save".');
        }
      }
    };
  }
}());
