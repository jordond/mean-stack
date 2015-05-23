(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name components.factory:Logger
   *
   * @description
   *
   */
  angular
    .module('components')
    .factory('logger', logger);

  logger.$inject = ['$log', '$filter', 'toastr'];

  function logger($log, $filter, toastr) {
    var service = {
      showToasts: true,

      error   : error,
      info    : info,
      success : success,
      warning : warning,

      log     : log
    };

    return service;

    function error(message, data, title) {
      toastr.error(message, title);
      $log.error('Error: ' + message, data);
    }

    function info(message, data, title) {
      toastr.info(message, title);
      $log.info('Info: ' + message, data);
    }

    function success(message, data, title) {
      toastr.success(message, title);
      $log.info('Success: ' + message, data);
    }

    function warning(message, data, title) {
      toastr.warning(message, title);
      $log.warn('Warning: ' + message, data);
    }

    function log(tag, message) {
      var timestamp = '[' + $filter('date')(new Date(), 'yyyy/dd/MM|HH:mm:ss') + ']';
      $log.log(timestamp + '[' + tag + '] ' + message);
    }
  }
}());
