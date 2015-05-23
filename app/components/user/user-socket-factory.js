(function () {
  'use strict';

  /**
   * @ngdoc factory
   * @name components.service:UserSocket
   *
   * @description
   *
   */
  angular
    .module('components')
    .factory('UserSocket', UserSocket);

  UserSocket.$injector = ['Socket', 'UserData'];

  function UserSocket(Socket, UserData) {
    var users
      , isActivated
      , service = {
          activate: activate,
          destroy: destroy
        };

    return service;

    /**
     * Public Methods
     */

    function activate() {
      if (!isActivated) {
        users = UserData.all()
          .then(function (response) {
            Socket.syncUpdates('user', response);
            return response;
          });
        isActivated = true;
      }
      return users;
    }

    function destroy() {
      Socket.unsyncUpdates('user');
    }
  }
}());
