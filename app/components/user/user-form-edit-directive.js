(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name home.directive:userFormEdit
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('userFormEdit', userFormEdit);

  function userFormEdit() {
    return {
      restrict: 'EA',
      scope: {
        value: '=',
        unlocked: '='
      },
      templateUrl: 'components/user/user-form-edit-directive.tpl.html',
      replace: false,
      link: function (scope, element, attrs) {
        var originalValue = scope.value;

        scope.unlocked = !attrs.hasOwnProperty('unlocked');

        scope.clicked = clicked;

        function clicked() {
          scope.unlocked = !scope.unlocked;
          scope.value = originalValue;
        }
      }
    };
  }
}());
