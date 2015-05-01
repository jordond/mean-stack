'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: { authenticate: authenticate }
      });

      function authenticate($q, Auth, $state, $timeout) {
        Auth.isLoggedInAsync(function (loggedIn) {
          if (loggedIn) {
            return $q.when();
          } else {
            $timeout(function() {
              $state.go('login');
            });
            return $q.reject();
          }
        });
      }

  });