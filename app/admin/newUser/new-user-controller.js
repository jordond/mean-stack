(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name admin.newUser.controller:NewUserCtrl
   *
   * @description
   *
   */
  angular
    .module('admin')
    .controller('NewUserCtrl', NewUserCtrl);

  function NewUserCtrl() {
    var vm = this;

    function submit(form) {

    }

    function createUser(user) {

    }

    function reset(form) {
      vm.user = {};
      form.$setPristine();
    }

    vm.submit = submit;
    vm.reset = reset;
  }
}());
