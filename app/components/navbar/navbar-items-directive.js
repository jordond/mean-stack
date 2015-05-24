(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:navbarItems
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('components')
    .directive('navbarItems', navbarItems);

  navbarItems.$injector = ['Auth'];

  function navbarItems(Auth) {
    return {
      restrict: 'EA',
      scope: {
        aside: '@'
      },
      templateUrl: 'components/navbar/navbar-items-directive.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: function () {
        var vm = this;
        Auth.getCurrentUser()
          .then(function () {
            vm.isAdmin = Auth.isAdmin();
          });
      }
    };
  }
}());
