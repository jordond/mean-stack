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

  function LoginCtrl(Auth, $location) {
    var vm = this
      , user = {}
      , submitted = false;

    function login(form) {
      submitted = true;

      if (form.$valid) {
        Auth.login({
          email: user.email,
          password: user.password
        })
        .then(function () {
          $location.path('/');
        });
      }
    }

    vm.user = user;
    vm.submitted = submitted;
    vm.login = login;
  }
}());
