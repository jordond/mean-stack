(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name account.controller:LoginCtrl
   *
   * @description
   *
   */
  angular
    .module('account')
    .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl($location, Auth) {
    var vm = this
      , user = {};

    function login(form) {
      if (form.$valid) {
        Auth.login({
          email: user.email,
          password: user.password
        })
        .then(function () {
          $location.path('/');
        })
        .catch(function () {
          vm.user = {};
          form.$setPristine();
        });
      }
    }

    vm.user = user;
    vm.login = login;
  }
}());
