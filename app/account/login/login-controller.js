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
      , errors = {}
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
        })
        .catch(function (err) {
          errors.other = err.message;
        });
      }
    }

    vm.user = user;
    vm.errors = errors;
    vm.submitted = submitted;
    vm.login = login;
  }
}());
