'use strict';

/**
 * @ngdoc directive
 * @name discussionToolApp.directive:attachedEntities
 * @description
 * # attachedEntities
 */
angular.module('discussionToolApp')
  .directive('attachedEntities', function (entitiesService) {
    return {
      templateUrl: 'views/templates/attached_entities.html',
      restrict: 'E',
      scope: {
        entities: '=entities'
      },
      link: function postLink(scope) {
        scope.isEntityClickDisabled = function (entity) {
          return ( entitiesService.isPlaceholder(entity) || entitiesService.isNotebook(entity) );
        };

        scope.attachedEntityClicked = function (entity, event) {
          entitiesService.attachedEntityClicked(entity, event);
        };
      }
    };
  });
