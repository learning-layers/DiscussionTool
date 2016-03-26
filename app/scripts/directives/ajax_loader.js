'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:ajaxLoader
 * @description
 * # ajaxLoader
 */
angular.module('discussionToolApp')
  .directive('ajaxLoader', function () {
    return {
      templateUrl: 'views/templates/ajax_loader.html',
      restrict: 'E',
      scope: {
        loadingComplete: '=loadingComplete',
        loaderSmallInline: '=loaderSmallInline'
      }
    };
  });
