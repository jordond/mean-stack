(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name components.factory:Auth
   *
   * @description
   *
   */
  angular
    .module('components')
    .factory('Auth', Auth);

  function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {}
      , roles = [];
    if ($cookieStore.get('token')) {
      currentUser = User.me();
      roles = User.getRoles();
    }

    return {
      login: function (user, callback) {
        var cb = callback || angular.noop
          , deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        })
        .success(function (data) {
          $cookieStore.put('token', data.token);
          currentUser = User.me();
          deferred.resolve(data);
          return cb();
        })
        .error(function (err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      logout: function () {
        $cookieStore.remove('token');
        currentUser = {};
      },

      // REFACTOR - admin creates users now
      createUser: function (user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function (data) {
            $cookieStore.put('token', data.token);
            currentUser = User.me();
            return cb(user);
          },
          function (err) {
            this.logout();
            return cb(err);
          }.bind(this))
        .$promise;
      },

      changePassword: function (oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({id: currentUser._id}, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function (user) {
          return cb(user);
        }, function (err) {
          return cb(err);
        })
        .$promise;
      },

      getRoles: function () {
        return roles.roles;
      },

      getCurrentUser: function () {
        return currentUser;
      },

      isLoggedIn: function () {
        return currentUser.hasOwnProperty('role');
      },

      isLoggedInAsync: function (cb) {
        if (currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function () {
            cb(true);
          })
          .catch(function () {
            cb(false);
          });
        } else if (currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      isAdmin: function () {
        return currentUser.role === 'admin';
      },

      getToken: function () {
        return $cookieStore.get('token');
      }
    };
  }
}());
