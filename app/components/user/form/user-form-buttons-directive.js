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
      compile: function (element, attrs) {
        if (!attrs.action) {
          attrs.action = 'save';
        }
      }
    };
  }
}());
