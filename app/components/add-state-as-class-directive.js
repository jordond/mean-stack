(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:addClassOnState
   * @restrict A
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('addStateAsClass', addStateAsClass);

  function addStateAsClass($location) {
    return {
      restrict: 'A',
      link: function ($scope) {
        var initialState = $location.url();

        $scope.currentState = initialState.replace('/', '');

        $scope.$on('stateChanged', function (event, stateName) {
          $scope.currentState = stateName;
        });
      }
    };
  }
}());
