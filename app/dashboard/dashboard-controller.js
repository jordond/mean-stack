(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name dashboard.controller:DashboardCtrl
   *
   * @description
   *
   * Very basic demo of the socket io abilities
   * including a notify callback.
   *
   */
  angular
    .module('dashboard')
    .controller('DashboardCtrl', DashboardCtrl);

  function DashboardCtrl($scope, $http, Socket, Auth) {
    var vm = this;

    vm.awesomeThings = [];

    Auth.isLoggedInAsync()
      .then(function (loggedIn) {
        vm.loggedIn = loggedIn;
      });

    $http.get('/api/things').success(function (awesomeThings) {
      vm.awesomeThings = awesomeThings;
      Socket.syncUpdates('thing', vm.awesomeThings)
        .then(function () {
          console.log('resolved');
        }, null, function () {
          console.log('notify');
        });
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
      Socket.unsyncUpdates('thing');
    });
  }
}());
