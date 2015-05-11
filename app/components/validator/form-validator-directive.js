(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:formValidator
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('formValidator', formValidator);

  function formValidator() {
    return {
      restrict: 'EA',
      scope: {
        control: '='
      },
      templateUrl: 'components/validator/form-validator-directive.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: function () {
        var vm = this;
        vm.name = 'formValidator';
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    };
  }
}());
