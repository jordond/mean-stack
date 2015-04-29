(function () {
  'use strict';

  /**
   * @ngdoc filter
   * @name resume.filter:capitalize
   *
   * @description
   *
   * @param {Array} input The array to filter
   * @returns {Array} The filtered array
   *
   */
  angular
    .module('components')
    .filter('capitalize', capitalize);

  function capitalize() {
    return function (input) {
      return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    };
  }
}());
