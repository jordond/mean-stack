(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.directive:passwordChange
   * @restrict EA
   * @element
   *
   * @description
   *
   *
   */
  angular
    .module('components')
    .directive('passwordChange', passwordChange);

  function passwordChange() {
    return {
      restrict: 'EA',
      scope: {
        id: '@'
      },
      templateUrl: 'components/user/password/password-change-directive.tpl.html',
      replace: false,
      controllerAs: 'vm',
      controller: function ($scope, $modal, Auth, UserData) {
        var vm = this
          , modal;

        /**
         * Initialize the modal, and asign scope values
         */
        function init() {
          vm.password = {};
          vm.isAdmin = Auth.isAdmin();

          modal = $modal({
            title: 'Change Password',
            template: 'components/user/password/password-change-modal.tpl.html',
            show: false,
            animation: 'am-fade-and-slide-top'
          });

          modal.$scope.submit = submit;
          modal.$scope.destroy = destroy;
          modal.$scope.password = vm.password;
          modal.$scope.isAdmin = vm.isAdmin;

          show();
        }

        /**
         * Handle the submitting and the response,
         * if successful close the modal, and wipe the fields
         * @return {Promise} Success or failure
         */
        function submit() {
          return changePassword($scope.id, modal.$scope.password)
            .then(function (success) {
              if (success) {
                destroy();
              }
              modal.$scope.password = {};
            });
        }

        /**
         * Call the UserData service to change the password
         * @param  {String} id        ID of the user
         * @param  {Object} passwords Contains password.old and password.new
         * @return {Promise}          Success or failure of change
         */
        function changePassword(id, passwords) {
          return UserData
            .changePassword($scope.id, passwords.old, passwords.new);
        }

        /**
         * When the modal is loaded, display it.
         */
        function show() {
          modal.$promise
            .then(modal.show);
        }

        /**
         * Hide and destroy the modal
         */
        function destroy() {
          modal.$promise
            .then(function () {
              modal.hide();
              modal.destroy();
            });
        }

        vm.init = init;
      }
    };
  }
}());
