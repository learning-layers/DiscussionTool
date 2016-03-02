'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:bitsAndPieces
 * @description
 * # bitsAndPieces
 */
angular.module('discussionToolApp')
  .directive('bitsAndPieces', function (episodesService, entitiesService) {

    return {
      restrict: 'E',
      templateUrl: 'views/templates/bits_and_pieces.html',
      scope: {
        version: '=version',
        orphaned: '=orphaned',
        model: '=model'
      },
      link: function postLink(scope) {
        scope.isInsideCircle = function (entity, circle) {
          return episodesService.isInsideCircle(entity, circle);
        };

        scope.isOrphaned = function(entity) {
          if ( scope.orphaned.indexOf(entity.id) !== -1 ) {
            return true;
          }

          return false;
        };

        scope.isEntityClickDisabled = function (entity) {
          return ( entitiesService.isPlaceholder(entity) || entitiesService.isNotebook(entity) );
        };

        scope.attachedEntityClicked = function (entity, event) {
          entitiesService.attachedEntityClicked(entity, event);
        };

        scope.getIcon = function (entity) {
          return entitiesService.getIconLocation(entity);
        };

        scope.fixNewlinesAndConvertToBr = function(text) {
          return entitiesService.fixNewlinesAndConvertToBr(text);
        };
      }
    };
  });
