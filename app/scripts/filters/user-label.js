'use strict';

/**
 * @ngdoc filter
 * @name discussionToolApp.filter:userLabel
 * @function
 * @description
 * # userLabel
 * Filter in the discussionToolApp.
 */
angular.module('discussionToolApp')
  .filter('userLabel', function () {
    return function (input) {
      return input.split('@')[0];
    };
  });
