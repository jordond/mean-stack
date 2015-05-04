(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name dashboard.controller:DashboardCtrl
   *
   * @description
   *
   */
  angular
    .module('dashboard')
    .controller('DashboardCtrl', DashboardCtrl);

  function DashboardCtrl($scope, $http, socket, Auth) {
    var vm = this;

    vm.awesomeThings = [];

    Auth.isLoggedInAsync(function (loggedIn) {
      vm.loggedIn = loggedIn;
    });

    $http.get('/api/things').success(function (awesomeThings) {
      vm.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', vm.awesomeThings);
    });

    vm.addThing = function () {
      if (vm.newThing === '') {
        return;
      }
      $http.post('/api/things', {name: vm.newThing});
      vm.newThing = '';
    };

    vm.deleteThing = function (thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }
}());
