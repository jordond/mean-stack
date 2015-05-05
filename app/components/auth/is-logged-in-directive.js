(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.auth.directive:isLoggedIn
   * @restrict A
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('isLoggedIn', isLoggedIn);

  function isLoggedIn(Auth) {
    return {
      restrict: 'A',
      link: function ($scope) {
        Auth.isLoggedInAsync(function (loggedIn) {
          if (!loggedIn) {
            $scope.loggedIn = loggedIn;
          }
        });
      }
    };
  }
}());
