(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name components.factory:User
   *
   * @description
   *
   */
  angular
    .module('components')
    .factory('User', userConfig);

  function userConfig($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      getRoles: {
        method: 'GET',
        params: {
          id: 'roles'
        }
      }
    });
  }
}());
