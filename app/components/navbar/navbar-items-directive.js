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
   * @example
     <example module="components">
       <file name="index.html">
        <navbar-items></navbar-items>
       </file>
     </example>
   *
   */
  angular
    .module('components')
    .directive('navbarItems', navbarItems);

  function navbarItems(JsonService) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'components/navbar/navbar-items-directive.tpl.html',
      replace: true,
      controllerAs: 'navbarItems',
      controller: function () {
        var vm = this;
        if (angular.equals({}, JsonService.json)) {
          JsonService.get()
            .then(function () {
              vm.sections = JsonService.find('sections');
            });
        } else {
          vm.sections = JsonService.find('sections');
        }
      }
    };
  }
}());
