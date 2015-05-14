(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:formValidatorClass
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('formValidatorClass', formValidatorClass);

  function formValidatorClass() {
    return {
      restrict: 'A',
      scope: {
        control: '='
      },
      replace: false,
      link: function (scope, element) {
        scope.$watch('control.$viewValue', function () {
          updateClass();
        });
        scope.$watch('control.$invalid', function () {
          updateClass();
        })

        function updateClass() {
          if (angular.isDefined(scope.control) && scope.control.$dirty) {
            if (scope.control.$invalid) {
              element.removeClass('has-success').addClass('has-error');
            } else if (scope.control.$valid) {
              element.removeClass('has-error').addClass('has-success');
            } else {
              element.removeClass('has-success has-error');
            }
          }
        }
      }
    };
  }
}());
