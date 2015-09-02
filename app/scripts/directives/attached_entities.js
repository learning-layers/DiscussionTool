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
        scope.isPlacehoder = function (entity) {
          return entity.type === 'placeholder';
        };
        
        scope.attachedEntityClicked = function (entity, event) {
          angular.element(event.currentTarget).blur();

          if ( entity.type === 'placeholder') {
            return;
          } else if ( entity.type === 'evernoteResource' || entity.type === 'evernoteNote' ) {
            var fileEntity = entitiesService.fehchFromDownloadLookupTable(entity.id);
            if ( fileEntity ) {
              window.open(entitiesService.constructFileDownloadUri(fileEntity.id));
            } else {
              var openedWindow = window.open();
              entitiesService.queryAndAddToDownloadLookupTable(entity.id)
                .then(function (fileEntity) {
                  openedWindow.location.replace(entitiesService.constructFileDownloadUri(fileEntity.id));
                }, function() {
                  openedWindow.close();
                });
            }
            return;
          } else if ( entity.type === 'file' ) {
            window.open(entitiesService.constructFileDownloadUri(entity.id));
            return;
          }
          window.open(entity.id);
        };
      }
    };
  });
