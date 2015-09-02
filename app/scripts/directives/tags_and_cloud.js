'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:tagsAndCloud
 * @description
 * # tagsAndCloud
 */
angular.module('discussionToolApp')
  .directive('tagsAndCloud', function (tagsService) {
    return {
      templateUrl: 'views/templates/tags_and_cloud.html',
      restrict: 'E',
      scope: {
        frequencies: '=frequencies',
        autocomplete: '=autocomplete',
        tags: '=tags',
        minFrequency: '=minFrequency',
        maxFrequency: '=maxFrequency'
      },
      link: function postLink(scope) {
        scope.addToTags = function(element, event) {
          if ( !scope.$parent._(scope.tags).find(function(tag) { return tag.text === element.label; }) ) {
            scope.tags.push({
              text: element.label
            });
          }
          angular.element(event.currentTarget).blur();
        };

        scope.calculateFontSize = function(element) {
          return tagsService.calculateFontSize(element.frequ, scope.minFrequency, scope.maxFrequency);
        };
      }
    };
  });
