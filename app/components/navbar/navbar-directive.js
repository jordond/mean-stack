(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:navbar
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('navbar', navbar);

  function navbar($location, JsonService) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'components/navbar/navbar-directive.tpl.html',
      replace: true,
      controllerAs: 'vm',
      controller: function ($scope) {
        var vm = this
          , isLogin = $location.url() === '/login';
        if (angular.equals({}, JsonService.json)) {
          JsonService.get()
            .then(function () {
              vm.title = JsonService.retrieve('title');
            });
        } else {
          vm.title = JsonService.retrieve('title');
        }

        $scope.$on('stateChanged', function (event, stateName) {
          vm.isLogin = stateName === 'login';
        });

        vm.isLogin = isLogin;
      }
    };
  }
}());
